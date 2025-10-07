<template>
  <div
    class="absolute flex flex-row justify-between items-center w-full h-16 px-2 md:px-16 bg-light text-dark dark:bg-dark dark:text-light text-sm md:text-2xl font-accent lowercase"
  >
    <div class="flex flex-row justify-start items-center w-full h-full">
      <NavHeadLogo />
    </div>

    <div
      class="flex flex-row justify-end gap-2 md:gap-8 items-center w-full h-full"
    >
      <NavHeadLink href="/" class="hidden md:block">About</NavHeadLink>
      <NavHeadLink href="/projects">Projects</NavHeadLink>
      <NavHeadLink href="/blog">Blog</NavHeadLink>
      <NavHeadLink href="/contact">Contact</NavHeadLink>
    </div>
  </div>
</template>
