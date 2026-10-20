---
title: "TINCLIB: Wi-Fi and HTTPS for a calculator with no radio"
description: "How I gave the TI-84 Plus CE verified HTTPS using an ESP8266 board, a custom serial protocol and a lot of very small buffers."
tags: [embedded, c, protocol-design, esp8266, ti-84-plus-ce]
related: [tinclib]
---

The TI-84 Plus CE has a USB port, a 48 MHz eZ80 processor and very little RAM. It has no Wi-Fi. TINCLIB is the stack that fixes that: plug an ESP8266 board into the calculator, and a C or C++ program can fetch a web page or call a REST API over verified HTTPS in a few lines.

```c
#include "tinclib.h"

static const tinc_config_t cfg = { "MYAPP", 0, TINC_CF_ASCII };
tinc_request_t req = { TINC_GET, "http://example.com/", NULL, NULL, 0 };
tinc_state_t st;
char buf[64];

if (tinc_init(&cfg) == TINC_OK && tinc_isActive(TINC_WIFI) && tinc_request(&req) == TINC_OK)
    while ((st = tinc_poll()) != TINC_DONE && st != TINC_ERROR) {
        int16_t n = tinc_read(buf, sizeof buf);
        /* use n bytes */
    }
tinc_shutdown();
```

This post walks through how it works and the decisions behind it. The project is four repos, all Apache 2.0:

| Repo                                                                | What it is                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------- |
| [tinclib](https://github.com/gavinhsmith/tinclib)                   | The C library a calculator program links against          |
| [tinclib-firmware](https://github.com/gavinhsmith/tinclib-firmware) | Firmware for the ESP8266 board, which does the networking |
| [tinclib-protocol](https://github.com/gavinhsmith/tinclib-protocol) | The wire protocol between calculator and board            |
| [tinclib-config](https://github.com/gavinhsmith/tinclib-config)     | TINCLIBC, the calculator app for Wi-Fi setup              |

## The big picture

The calculator never touches the network. It sends framed commands over USB serial, and the board does everything else.

```text
TI-84 Plus CE ──USB serial──> ESP8266 board ──Wi-Fi──> the internet
   (tinclib)                  (tinclib-firmware)
```

A request follows this path:

1. The program calls `tinc_request()`. tinclib turns it into a `REQ_BEGIN` frame (method, URL, headers) and streams it out over USB. The calculator is the USB host, and the board's bridge chip is the device.
2. The board's UART receives the bytes. The firmware reassembles the frame, checks the CRC, and routes it to a handler.
3. A request state machine advances one step per loop iteration: DNS, TCP connect, and for https a wait for a valid clock followed by the TLS handshake.
4. The firmware sends the request and parses the response itself: status line, headers, chunked decoding. The calculator only ever sees decoded bytes.
5. The program calls `tinc_poll()`, which checks the request status and pre-fetches the next chunk of the body. `tinc_read()` copies bytes out, and `tinc_header()` reads a response header such as `Location`.
6. When the last chunk is read the request finishes and releases itself. There is no handle to free.

One hardware note: the calculator's USB driver only supports CDC, FTDI and PL2303 bridge chips, so boards with a CP210x or CH340 bridge will not talk to it.

## The protocol

The protocol lives in its own repo as a single plain C99 header, `protocol.h`, plus a reference frame encoder and parser. The library, the firmware and the setup app all build those files unchanged from a pinned git tag. Nobody copies them.

A frame looks like this:

```text
[SOF 0xA5][FLAGS:1][TYPE:1][SEQ:1][LEN:2][PAYLOAD:LEN][CRC16:2]
```

Each field earns its place:

- **SOF (`0xA5`)** marks where a frame starts in a raw byte stream. The board's UART also carries the ROM bootloader's boot text, which the parser throws away because it never forms a valid frame.
- **FLAGS** says whether a frame is a reply, an error reply, or (reserved, unused) an event. Reserved bits are sent as 0 and ignored, so the format has room to grow.
- **TYPE** is the command. An unknown type gets an explicit `ERR_UNSUPPORTED` rather than silence, so new message types can be added without hanging an older peer.
- **SEQ** is bumped for each new frame and reused on a retry. Replies echo it.
- **LEN** is the payload length, up to 1024 bytes. There is no end marker, so it says where the CRC is. An oversize length is dropped, so a receiver can never overrun its buffer.
- **CRC-16/CCITT-FALSE** covers everything after the SOF. It detects line noise and dropped bytes. It cannot repair anything, so a bad frame is simply dropped and the sender retries.

Everything is little-endian, and every payload is read and written by byte offset instead of through packed structs. Packed structs are not C99, and unaligned access is a trap on the ESP's Xtensa core. The shared sources have to compile for the eZ80, Xtensa and a PC alike.

### Surviving a lossy link

Serial links drop and corrupt bytes, and a calculator can be unplugged at any moment, so reliability is part of the protocol:

- **Retries never run a command twice.** The calculator reuses a SEQ on retry, and the board caches its last reply and replays it verbatim for a repeated SEQ. A lost reply to a POST cannot cause a double submit.
- **Body transfer is offset-based.** Reading the same offset again re-delivers the identical chunk, and reading the next offset advances and frees the old one. A retry needs no extra state.
- **The board never pushes data.** Every body byte crosses the wire because the calculator asked for it. The calculator's RAM is the scarce resource, so the protocol is pull-based.
- **Resets are detectable.** Everything except `HELLO` gets `ERR_NO_HELLO` until the handshake succeeds, so a board reset shows up as an error on the next frame. The library re-handshakes and fails the in-flight request instead of resending it.
- **Timeouts are per phase.** The board must answer any frame within 200 ms. The calculator retries up to 3 times, and the board frees a request after about 30 seconds of silence.

| What goes wrong              | What happens                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| A request frame is corrupted | The board drops it silently. The calculator's timeout fires and it resends with the same SEQ. |
| A reply is lost              | The board replays its cached reply. The command does not run again.                           |
| A body chunk is lost         | Re-reading the same offset re-delivers it.                                                    |
| The board resets mid-request | The next frame gets `ERR_NO_HELLO`, the library re-handshakes, and the request fails cleanly. |
| The calculator disappears    | The board frees the request after about 30 seconds.                                           |

Versioning is strict while the protocol is pre-1.0: any minor bump may break the wire format, so `HELLO` requires an exact match. The current version is 0.7. From 1.0, payloads are append-only and receivers ignore trailing bytes they do not know about.

## The calculator side

The library is built for a machine with almost no RAM:

- **No `malloc`.** Buffers are static and sized at compile time. There is one shared 264-byte frame buffer, which also holds the pre-fetched body chunk, plus a 256-byte serial ring buffer. Frames are streamed out piece by piece, so there is no transmit buffer at all.
- **Static linking instead of LibLoad.** A shared LibLoad library would have to be written in raw eZ80 assembly and is poorly documented. Instead the library's source is compiled into each program, and the linker drops whatever the program does not call. A program that only checks the connection is 4,135 bytes. The same program using the whole API, POST and header reads included, is 10,030 bytes. `make size-check` runs in CI and fails if that gap shrinks below 2,000 bytes, so dead-code elimination cannot quietly regress.
- **A deliberately small API.** The library owns the single in-flight request, and `tinc_poll()` is the only pump. An earlier design had a request handle and separate info calls. I walked it back once one-request-at-a-time made it scaffolding.
- **eZ80 details matter.** The native `int` is 24 bits, so wire code uses explicit `uint8_t` and `uint16_t` types everywhere.
- **C++ costs almost nothing.** `tinclib.hpp` is a header-only wrapper with no exceptions and no allocation. A `tinc::Session` calls init and shutdown by scope, and the bindings add 16 bytes over calling the C API from C++.

### Wi-Fi setup and the handoff

Wi-Fi setup is a separate calculator program, TINCLIBC. It shows connection status, manages saved networks, and runs a connection test that makes one HTTPS request and reports the TLS failure reason if it fails.

A program that needs setup calls `tinc_openConfig()`, which writes a request into an appvar and launches TINCLIBC. TINCLIBC writes back a result and exits, and the original program starts over from `main()` through an `os_RunPrgm` return callback. The calling program is unloaded, so it must save its own state first.

This design came from a spike. Having TINCLIBC relaunch the calling program crashed the calculator in the CEmu emulator even with no tinclib code involved, so TINCLIBC now exits and lets the callback bring control back.

## The board side

The firmware is one target-independent core plus a thin platform layer per target. The core is plain C99 with no Arduino or OS calls: UART framing, a dispatcher, the request state machine, an HTTP response parser, ASCII transcoding and Wi-Fi ranking. Each target implements one interface, `tinc_platform.h`: clock, heap, UART, non-blocking TCP, Wi-Fi status and slot storage. Targets today are the ESP8266 and a PC build.

**It never blocks.** On the ESP8266 a long block starves Wi-Fi housekeeping, and on every chip it would make the calculator's 200 ms reply timeout fire. DNS, TCP connect, the TLS handshake, UART writes and Wi-Fi joins all make progress one loop iteration at a time. `WiFiClient::connect()` blocks, so the ESP8266 layer uses lwIP's raw API instead. Data from the server is acknowledged only as the calculator reads it, so a slow reader slows the download instead of filling RAM.

**It owns HTTP.** Status line, headers, chunked decoding and content length are parsed in the core rather than by the Arduino HTTP client. The pull-based body reads and the optional ASCII transcoding (which turns curly quotes, em-dashes and accents into calculator-safe ASCII) need control that a blocking, all-at-once client does not give.

**Wi-Fi joining is signal-based.** The board scans, matches saved networks, and tries the strongest signal first, falling through to the next on failure. It ranks by BSSID as well as SSID for multi-AP networks, ignores networks below about -85 dBm, and does not roam while connected. There are 5 saved slots on the ESP8266, and hidden networks are supported. The slot count is set by the firmware and reported in `HELLO`, so the calculator never assumes a number. Passwords are write-only: no command can read one back, and no API keys are ever stored. Apps send credentials in headers on each request, and the firmware never logs headers.

## TLS on a small chip

HTTPS is the v1 priority, and it is always certificate-checked. There is no insecure mode.

The ESP8266 has roughly 40 to 50 KB of free heap after Wi-Fi comes up, and BearSSL wants about 16.7 KB of that for its receive buffer. The firmware checks free heap before starting a session and fails cleanly with `ERR_NO_MEM` instead of letting the TLS library fail messily. Other constraints shaped the design:

- **The trust store is baked into the firmware.** Mozilla's CA roots become a flash-resident table at build time, looked up by the SHA-256 of the issuer name with one key copied into RAM at a time. That costs little RAM, works against arbitrary sites, and needs no filesystem upload that could overwrite the Wi-Fi slots. I chose it over per-service pinning, which breaks on key rotation. A reflash updates the roots.
- **Certificates need a clock.** The board sets its time over SNTP after joining Wi-Fi, and HTTPS waits for it. If the clock never arrives, the calculator sees `ERR_TIME`.
- **TLS stops at 1.2.** BearSSL has no TLS 1.3, so a server that requires it fails with a clear error instead of hanging.
- **Failures say why.** The protocol defines its own reason codes (expired, not yet valid, wrong hostname, untrusted root, bad chain, no common version). The firmware maps its TLS library's errors onto them, so the TLS library can change without changing the wire format.

### The handshake and the 200 ms rule

A single big-number operation in a TLS handshake cannot be split, so it can stall the board for hundreds of milliseconds. I measured it on the ESP8266: one handshake step took about 850 ms with X25519, against roughly 470 and 515 ms for two steps with P-256. X25519 key generation has no precomputed table on that chip, so the TLS layer does not offer it.

The protocol still has to keep the link responsive, so it carves out one exception. While a request may be in TLS, the board has 1000 ms to answer instead of 200, and only then. The calculator cannot see when a request enters TLS, so for an https request it uses the longer timeout until a reply shows the request is past the handshake. Everything else, including DNS, connect and abort handling, stays under 200 ms, so an abort always gets through.

### Redirects and secrets

Because the board follows redirects, it also has to protect credentials. An https-to-http redirect is refused. A redirect to a different host drops all of the app's headers, so an API key only ever reaches the host the app named. Only GET and HEAD follow redirects at all. For other methods the 3xx is the response, and the app reads `Location` itself, which avoids buffering a whole request body in the board's RAM.

## Testing without the hardware

Embedded work is slow if every test needs a calculator, a board and a cable, so most of the stack can be tested without them:

- **The firmware runs on a PC.** The same core builds as a Windows, Linux and macOS app. Plug the calculator straight into the PC and the app answers it like a board, using the PC's own network. It reports one locked Wi-Fi slot called LAN.
- **A readable packet trace.** Every frame prints as one line. Header text, request bodies, query strings and Wi-Fi passwords are replaced by their lengths, because URLs often carry API keys, and response bodies are cut to 48 bytes.
- **Bridge mode.** The PC passes bytes unchanged between the calculator and a real board while tracing everything, so a board can be tested before it has its own power.
- **Golden vectors.** The protocol repo generates valid and invalid frames as hex files and a C header. Every implementation tests against the same bytes, and the CRC check value (the ASCII string `123456789` gives `0x29B1`) must pass on the eZ80, the Xtensa and the PC.
- **Fake boards in unit tests.** The firmware core runs against an in-memory fake platform. The library's host tests, built with ASan and UBSan under gcc and clang, talk to a fake board that uses the protocol repo's own parser and encoder.
- **Fuzzing.** libFuzzer targets cover the frame parser and the firmware's dispatcher.
- **Emulator and hardware.** CEmu tests drive the calculator programs, and full requests through real firmware have been tested on hardware.

## What the real hardware taught me

- **RAM is tighter than the arithmetic says.** TINCLIBC failed with `ERR: MEMORY` on a real calculator even with 63 KB free, because the program is copied into RAM and five libraries load beside it. After a RAM reset it started. I have not yet measured the exact minimum.
- **Windows needs time to load a driver.** With the calculator plugged straight into a PC, `tinc_init()` originally gave up after 600 ms, before Windows had loaded its serial driver. It now retries the handshake for up to 2 seconds and keeps USB up across repeated attempts instead of re-enumerating, which had been making the COM port vanish on every retry.
- **Emulators have bugs too.** In CEmu, handing off to a program larger than the caller crashes the calculator. TINCLIBC is about 37 KB, so that test fails, and it blocks automated releases of the config app. It is still open.

## Tradeoffs and what is next

- **ESP8266, not ESP32, for now.** HTTPS was the critical requirement, and the ESP8266 is the smallest target, so the core is sized for it. An ESP32 port only needs a new platform layer. It is planned, and it brings its own care around lwIP running in a separate task and a different TLS library.
- **Bluetooth is deferred to v2.** The ESP8266 has no Bluetooth hardware at all. When it arrives it will be gated through capability bits in `HELLO`.
- **No scan yet.** Protocol 0.7 has no Wi-Fi scan, connect-now or insecure-TLS toggle, so TINCLIBC cannot browse nearby networks.
- **Admin commands are open.** Anything that can open the serial link can change the saved Wi-Fi profiles. A physical-button confirmation has been discussed but not decided, and the Wi-Fi lock is set on the board only, never over the wire.
- **Other deferred items:** CA bundle updates over the wire, chunked uploads and a boot event.

The best part of this project has been how much it forced me to design for failure: every packet can vanish, every buffer is tiny, and every assumption gets tested on real hardware sooner or later. If you build calculator programs and want them online, the repos are linked above, and the README in [tinclib](https://github.com/gavinhsmith/tinclib) has a complete example.
