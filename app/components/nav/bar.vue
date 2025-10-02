<template>
  <div
    class="flex flex-row justify-between items-center h-16 px-4 md:px-16 bg-dark text-light text-lg md:text-2xl font-accent lowercase"
  >
    <NavLogo />

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
