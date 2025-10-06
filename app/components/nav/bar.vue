<template>
  <div
    class="absolute flex flex-row justify-between items-center w-full h-16 px-4 md:px-16 bg-light text-dark dark:bg-dark dark:text-light text-lg md:text-2xl font-accent lowercase"
  >
    <div class="flex flex-row justify-start items-center w-full h-full">
      <NavLogo />
    </div>

    <div
      class="flex flex-row justify-end gap-3 md:gap-8 items-center w-full h-full"
    >
      <NavLink href="/">About</NavLink>
      <NavLink href="/projects">Projects</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </div>
  </div>
</template>
