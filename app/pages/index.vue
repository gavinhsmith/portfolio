<template>
  <div class="w-full h-full p-18">
    <!-- Pushes down the content to not be behind the navbar. -->
    <NavHeadBumper />

    <!-- Main body... -->
    <div class="text-7xl flex flex-col">
      <h1>Howdy! I'm <strong class="font-extrabold">Gavin</strong>.</h1>
      <h1>Your next</h1>
      <h1 class="font-accent">
        <Typewriter
          :words="[
            'HTML / CSS / JS',
            'React / Vue',
            'Next / Nuxt',
            'Java',
            'C#',
            '.NET',
            'C / C++',
            'Rust',
            'frontend',
            'backend',
            'full-stack',
            'everything',
          ]"
          :wait="200"
          :loop="false"
          :immediate="true"
        ></Typewriter>
      </h1>
      <h1>developer.</h1>
    </div>
    <div class="mt-12">
      <p class="text-3xl">
        Here you can find my professional/personal projects and affiliations.
        Currently, this corner of the internet is
        <strong>under construction</strong> due to my classwork occupying most
        of my time. Keep in touch with me on my
        <a
          href="https://github.com/gavinhsmith"
          class="link link-sm hover:text-accent-light"
          >&#xec1c; GitHub</a
        >
        or.
      </p>
    </div>
  </div>
</template>
