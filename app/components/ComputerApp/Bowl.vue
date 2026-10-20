<script setup>
// A 3D scene: the windows inside sit on the inner wall of a bowl we look down into.
// Bowl: a shallow sphere centered on this element. A window's distance from the center
// sets how steeply it faces inward and how close it sits (the rim is nearer than the bottom).
// Gaze: the whole bowl turns slightly toward the cursor, or, once the cursor rests, toward
// a point that wanders slowly around the middle. A hovered window lies flat.
// Every window shares one camera (perspective centered on the bowl), so they read as one
// scene. One loop updates every window straight on its element, eased in JS.
//
// Windows join by being ComputerAppContainers inside this component (see provide below).
// The bowl also times their return: after the last drag, all moved windows go home together.
// Desktop mouse/trackpad only, and off for reduced motion: otherwise windows stay flat.
const PERSPECTIVE = 1100; // px, camera distance
const BOWL = 1.1; // bowl radius, in multiples of the larger screen side (smaller = steeper)
const MAX_GAZE = 4; // degrees the bowl turns toward the cursor
const WANDER = 0.35; // idle gaze range, as a fraction of half the bowl
const IDLE_MS = 2500; // cursor still this long -> start looking around
const EASE_MS = 220; // smoothing time constant for gaze and hover

const RETURN_MS = 3000; // moved windows all head home together this long after the last drag

const el = ref(null);
const windows = new Set(); // { root, face, hovered(), goHome(), flat }
let returnTimer;
provide("bowl", {
  join: (win) => windows.add(Object.assign(win, { flat: 0 })),
  leave: (win) => {
    windows.delete(win);
    win.face.value?.style.removeProperty("transform");
  },
  // one shared timer: any grab pauses it, any release restarts it
  holdReturn: () => clearTimeout(returnTimer),
  scheduleReturn: () => {
    clearTimeout(returnTimer);
    returnTimer = setTimeout(
      () => windows.forEach((w) => w.goHome()),
      RETURN_MS,
    );
  },
});

let pointer = null;
let lastMove = 0;
let frame = 0;
let last = 0;
const gaze = { x: 0, y: 0 };
const phase = [Math.random() * 6.3, Math.random() * 6.3];

function tick(now) {
  frame = requestAnimationFrame(tick);
  const k = 1 - Math.exp(-(now - (last || now)) / EASE_MS); // frame-rate independent easing
  last = now;

  const b = el.value.getBoundingClientRect();
  const center = { x: b.left + b.width / 2, y: b.top + b.height / 2 };

  // where the gaze points, as -1..1 of half the bowl from its center
  let tx, ty;
  if (pointer && now - lastMove < IDLE_MS) {
    tx = (pointer.x - center.x) / (b.width / 2);
    ty = (pointer.y - center.y) / (b.height / 2);
  } else {
    const t = now / 1000; // slow, mismatched periods (~17s, ~23s): smooth, never in step
    tx = WANDER * Math.sin(t / 2.7 + phase[0]);
    ty = WANDER * Math.sin(t / 3.7 + phase[1]);
  }
  gaze.x += (Math.max(-1, Math.min(1, tx)) - gaze.x) * k;
  gaze.y += (Math.max(-1, Math.min(1, ty)) - gaze.y) * k;

  const R = BOWL * Math.max(innerWidth, innerHeight);
  for (const win of windows) {
    const root = win.root.value,
      face = win.face.value;
    if (!root || !face) continue;
    win.flat += ((win.hovered() ? 1 : 0) - win.flat) * k;
    const live = 1 - win.flat;

    // this window's place in the bowl (its outer box isn't tilted, so it's the true position)
    const r = root.getBoundingClientRect();
    const wx = r.left + r.width / 2 - center.x;
    const wy = r.top + r.height / 2 - center.y;
    const d = Math.min(Math.hypot(wx, wy), R * 0.9);
    const wall = ((Math.asin(d / R) * 180) / Math.PI) * live; // wall angle at this distance
    const lift = (R - Math.sqrt(R * R - d * d)) * live; // height above the bowl's bottom
    // turn about the axis perpendicular to center->window, so the window faces the center
    const ax = d ? wy / d : 0;
    const ay = d ? -wx / d : 0;

    // origin = bowl center, so perspective and gaze are shared by every window
    face.style.transformOrigin = `${center.x - r.left}px ${center.y - r.top}px`;
    face.style.transform =
      `perspective(${PERSPECTIVE}px)` +
      ` rotateX(${-gaze.y * MAX_GAZE * live}deg) rotateY(${gaze.x * MAX_GAZE * live}deg)` +
      ` translate3d(${wx}px, ${wy}px, ${lift}px)` +
      ` rotate3d(${ax}, ${ay}, 0, ${wall}deg)` +
      ` translate3d(${-wx}px, ${-wy}px, 0)`;
  }
}

const onPointer = (e) => {
  if (e.pointerType !== "mouse") return;
  pointer = { x: e.clientX, y: e.clientY };
  lastMove = performance.now();
};
const onLeave = () => (pointer = null);

onMounted(() => {
  if (
    !matchMedia("(min-width: 48rem) and (pointer: fine)").matches ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  frame = requestAnimationFrame(tick); // paused by the browser in hidden tabs
});
onUnmounted(() => {
  clearTimeout(returnTimer);
  cancelAnimationFrame(frame);
  removeEventListener("pointermove", onPointer);
  document.documentElement.removeEventListener("pointerleave", onLeave);
});
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
