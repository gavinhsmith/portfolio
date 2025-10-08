<template>
  <div class="flex flex-col justify-between w-full h-screen">
    <div class="flex-none">
      <NavHeadBar />
    </div>
    <div class="flex-1 h-full font-main text-xl">
      <slot />
    </div>
    <div class="flex-none">
      <NavFootBar />
    </div>
  </div>
</template>
