<template>
  <a
    class="flex flex-row justify-start items-center h-full gap-6 hover:[&>img]:translate-y-3 hover:[&>img]:drop-shadow-xl"
    :href="$route.path === '/' ? '#' : '/'"
  >
    <img
      class="h-24 md:h-32 transition-all drop-shadow-md"
      src="~/assets/icon/flag_g.svg"
      alt="'G' Flag"
    />

    <span class="hidden lg:block">Gavin Smith</span>
  </a>
</template>
