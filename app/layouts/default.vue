<template>
  <div class="flex flex-col justify-between w-full min-h-screen">
    <NavHeadBar />
    <div
      class="bg-white text-black dark:bg-black dark:text-white w-full h-full font-main text-xl"
    >
      <slot />
    </div>
    <NavFootBar />
  </div>
</template>
