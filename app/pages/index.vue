<template>
  <div class="w-full h-full px-18 py-17">
    <!-- Pushes down the content to not be behind the navbar. -->
    <NavHeadBumper />

    <!-- Main body... -->
    <div class="text-3xl lg:text-7xl flex flex-col">
      <h1>
        Howdy! I'm
        <strong>Gavin</strong>.
      </h1>
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
            'desktop',
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
      <p class="text-lg lg:text-3xl">
        I am currently an undergraduate student at the
        <a
          href="https://wisc.edu"
          target="_blank"
          class="link link-sm text-accent-light italic"
          >University of Wisconsin-Madison</a
        >. Here you can find my professional/personal projects and affiliations.
        Currently, this corner of the internet is
        <strong>under construction</strong> due to my classwork occupying most
        of my time. Keep in touch with me below:
      </p>
    </div>
    <div>
      <div
        class="w-full flex flex-col lg:flex-row justify-start items-center gap-10 text-2xl lg:text-4xl font-accent"
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
