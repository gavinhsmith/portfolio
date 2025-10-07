<template>
  <div class="flex flex-col justify-between w-full min-h-screen">
    <NavHeadBar />
    <div class="w-full h-full font-main text-xl">
      <slot />
    </div>
    <NavFootBar />
  </div>
</template>
