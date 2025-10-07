<template>
  <div
    class="flex flex-row justify-between items-center h-12 px-8 text-sm lg:text-lg font-accent bg-light text-dark dark:bg-dark dark:text-light"
  >
    <div class="flex flex-row justify-start items-center">
      <span>(c) 2025 - Gavin Smith</span>
    </div>
    <div class="flex flex-row justify-end items-center">
      <Typewriter
        :words="['Howdy!', 'Hello!', 'Hi!', 'Yo!']"
        :loop="true"
        :wait="750"
      />
    </div>
  </div>
</template>
