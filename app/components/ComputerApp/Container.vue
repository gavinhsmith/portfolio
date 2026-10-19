<script>
// Shared across all windows: the last-grabbed window goes on top.
let topZ = 1;
</script>

<script setup>
const props = defineProps({
  title: String,
  icon: String,
  movable: Boolean,
});

// Movable windows react to a desktop mouse/trackpad only: on touch screens
// the title bar must not steal scrolling.
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

// --- Bowl: inside a ComputerAppBowl, the bowl tilts this window (see Bowl.vue). ---
const bowl = inject("bowl", null);
const face = ref(null);
let hovered = false;
// hover is tracked on the untilted outer box, so the tilting edge can't flicker it
const win = { root, face, hovered: () => hovered };
onMounted(() => bowl?.join(win));
onUnmounted(() => {
  bowl?.leave(win);
  clearTimeout(returnTimer);
});
</script>

<template>
  <!-- outer: drag offset + stacking; inner: the window itself, tilted by a parent bowl.
       Kept separate so tilting never restarts the slow return transition. -->
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
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
  >
    <div
      ref="face"
      class="w-full h-full rounded-md flex flex-col drop-shadow-lg overflow-hidden"
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
