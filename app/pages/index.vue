<template>
  <LayoutCentered>
    <TextExtraBig>
      <h1>Howdy! I'm <strong>Gavin</strong>.</h1>
      <span>Your next</span>
      <span class="font-accent">
        <EffectTypewriter
          :words="[
            'HTML / CSS / JS',
            'React / Vue',
            'Next / Nuxt',
            'Python',
            'Golang',
            'Java / Kotlin',
            'Swift',
            'C# / .NET',
            'C / C++',
            'Rust',
            'mobile',
            'desktop',
            'IoT',
            'frontend',
            'backend',
            'full-stack',
            'anything & everything',
          ]"
          :wait="300"
          :loop="false"
          :immediate="true"
          :colorize-last="true"
        />
      </span>
      <span>developer!</span>
    </TextExtraBig>
    <TextParagraph>
      <p>
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
    </TextParagraph>
    <div class="flex flex-col lg:flex-row gap-3 w-full lg:w-1/2">
      <ButtonExternalLink
        href="https://github.com/gavinhsmith"
        icon="tabler:brand-github"
      >
        GitHub
      </ButtonExternalLink>
      <ButtonExternalLink href="mailto:me@gavinhsmith.com" icon="tabler:mail">
        Email
      </ButtonExternalLink>
    </div>
  </LayoutCentered>
</template>
