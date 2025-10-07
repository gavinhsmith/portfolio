<template>
  <div class="w-full h-full p-18">
    <!-- Pushes down the content to not be behind the navbar. -->
    <NavHeadBumper />

    <!-- Main body... -->
    <div class="text-5xl lg:text-7xl flex flex-col">
      <h1>Howdy! I'm <strong class="font-extrabold">Gavin</strong>.</h1>
      <h1>Your next</h1>
      <h1 class="font-accent">
        <Typewriter
          :words="[
            'HTML / CSS / JS',
            'React / Vue',
            'Next / Nuxt',
            'Java',
            'Koltin',
            'Swift',
            'C#',
            '.NET',
            'C / C++',
            'Rust',
            'mobile',
            'frontend',
            'backend',
            'full-stack',
            'everything',
          ]"
          :wait="200"
          :loop="false"
          :immediate="true"
          :colorize-last="true"
        ></Typewriter>
      </h1>
      <h1>developer.</h1>
    </div>
    <div class="my-10">
      <p class="text-3xl">
        Here you can find my professional/personal projects and affiliations.
        Currently, this corner of the internet is
        <strong>under construction</strong> due to my classwork occupying most
        of my time. Keep in touch with me below:
      </p>
    </div>
    <div>
      <div
        class="w-full flex flex-col lg:flex-row justify-start items-center gap-10 text-4xl font-accent"
      >
        <a href="https://github.com/gavinhsmith" class="w-full lg:w-fit button">
          <Icon name="tabler:brand-github" />
          <span>GitHub</span>
        </a>
        <a href="mailto:me@gavinhsmith.com" class="w-full lg:w-fit button">
          <Icon name="tabler:mail" />
          <span>Email</span>
        </a>
      </div>
    </div>
  </div>
</template>
