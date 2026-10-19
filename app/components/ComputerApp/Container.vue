<script>
// Shared across all windows: the last-grabbed window goes on top.
let topZ = 1;
</script>

<script setup>
const props = defineProps({
  title: String,
  icon: String,
  movable: Boolean,
  tilt: Boolean,
});

// Movable/tilting windows react to a desktop mouse/trackpad only: on touch screens
// the title bar must not steal scrolling, and there's no cursor to face.
const finePointer = () =>
  matchMedia("(min-width: 48rem) and (pointer: fine)").matches;

// --- Move: drag by the title bar; 3s after release the window drifts back home. ---
const offset = reactive({ x: 0, y: 0 });
const z = ref(0);
const returning = ref(false);
const root = ref(null);
let grab = null;
let returnTimer;

const canMove = () => props.movable && finePointer();

function onDown(e) {
  if (!canMove() || e.button !== 0) return;
  clearTimeout(returnTimer); // grabbed while waiting to return: stay put
  if (returning.value) {
    // caught mid-return: continue from where it visually is, not where it's headed
    const m = new DOMMatrix(getComputedStyle(root.value).transform);
    Object.assign(offset, { x: m.m41, y: m.m42 });
    returning.value = false;
  }
  grab = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  e.currentTarget.setPointerCapture(e.pointerId);
}
function onMove(e) {
  if (!grab) return;
  offset.x = e.clientX - grab.x;
  offset.y = e.clientY - grab.y;
}
function onUp() {
  if (!grab) return;
  grab = null;
  returnTimer = setTimeout(() => {
    returning.value = true;
    Object.assign(offset, { x: 0, y: 0 });
  }, 3000);
}

// --- Tilt: the window turns slightly to face the cursor, and settles flat while hovered. ---
const MAX_TILT = 6; // degrees
const tiltDeg = reactive({ x: 0, y: 0 });
const face = ref(null);
let pointer = null;
let frame = 0;
let hovered = false;

function aim() {
  frame = 0;
  if (!pointer || hovered || !face.value) return Object.assign(tiltDeg, { x: 0, y: 0 });
  const r = face.value.getBoundingClientRect();
  // cursor offset from this window's center, as a fraction of half the screen
  const dx = (pointer.x - (r.left + r.width / 2)) / (innerWidth / 2);
  const dy = (pointer.y - (r.top + r.height / 2)) / (innerHeight / 2);
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  tiltDeg.y = clamp(dx) * MAX_TILT; // + turns the right edge away = faces right
  tiltDeg.x = -clamp(dy) * MAX_TILT; // + turns the top edge away = faces up
}
const schedule = () => (frame ||= requestAnimationFrame(aim));
const onPointer = (e) => {
  pointer = e.pointerType === "mouse" ? { x: e.clientX, y: e.clientY } : null;
  schedule();
};
const onLeave = () => {
  pointer = null;
  schedule();
};
// hover is tracked on the untilted outer box, so the tilting edge can't flicker it
const setHover = (on) => {
  hovered = on;
  schedule();
};

onMounted(() => {
  if (
    !props.tilt ||
    !finePointer() ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
});
onUnmounted(() => {
  clearTimeout(returnTimer);
  cancelAnimationFrame(frame);
  removeEventListener("pointermove", onPointer);
  document.documentElement.removeEventListener("pointerleave", onLeave);
});
</script>

<template>
  <!-- outer: drag offset + stacking; inner: the window itself, tilted. Kept separate so
       tilting never restarts the slow return transition. -->
  <div
    ref="root"
    class="relative w-full h-full"
    :class="{
      'motion-safe:transition-transform motion-safe:duration-[2500ms] motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)]':
        returning,
    }"
    :style="{
      transform: movable
        ? `translate(${offset.x}px, ${offset.y}px)`
        : undefined,
      zIndex: z || undefined,
    }"
    @pointerdown.capture="movable && canMove() && (z = ++topZ)"
    @transitionend.self="returning = false"
    @pointerenter="tilt && setHover(true)"
    @pointerleave="tilt && setHover(false)"
  >
    <div
      ref="face"
      class="w-full h-full rounded-md flex flex-col drop-shadow-lg overflow-hidden"
      :class="{ 'transition-transform duration-500 ease-out': tilt }"
      :style="{
        transform:
          tilt && (tiltDeg.x || tiltDeg.y)
            ? `perspective(900px) rotateX(${tiltDeg.x}deg) rotateY(${tiltDeg.y}deg)`
            : undefined,
      }"
    >
      <div
        class="w-full h-fit p-1 bg-porcelain text-ink-black font-sans flex flex-row justify-between"
        :class="{
          'md:cursor-grab md:active:cursor-grabbing select-none': movable,
        }"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <div class="flex flex-row items-center gap-1">
          <Icon v-if="icon" :name="icon" />
          <span class="mb-0.5 text-sm">{{ title }}</span>
        </div>
        <div class="mr-0.5 flex flex-row items-center gap-1">
          <span class="bg-golden-glow w-2 h-2 rounded" />
          <span class="bg-harvest-orange w-2 h-2 rounded" />
          <span class="bg-oxblood w-2 h-2 rounded" />
        </div>
      </div>
      <div class="w-full h-full">
        <slot />
      </div>
    </div>
  </div>
</template>
