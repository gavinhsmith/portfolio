/** Typewriter effect. */

<script setup>
// Define the properties as an array of words, if the word list should loop at the end, and how long (in ms) to wait between words.
const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
  loop: {
    type: Boolean,
    required: true,
  },
  wait: {
    type: Number,
    required: false,
  },
  immediate: {
    type: Boolean,
    required: false,
  },
});

// Define the current text displayed and the carot display indicator
const value = ref("");
const carot = ref(true);
const carotOn = ref(true);

// Get the final values of the component.
const words = props.words;
const loop = props.loop ?? true;
const wait = props.wait ?? 1500;
const immediate = props.immediate ?? false;
let currentWord = 0;
let currentChar = 0;

// Blinking carot.
const carotInt = setInterval(() => {
  carot.value = !carot.value;
}, 500);

// Recursive function to create and destroy intervals, imitating typing.
function createWordInterval() {
  const interval = setInterval(() => {
    // Add the next character of the word to the text, and increase the current char index.
    value.value += words[currentWord].slice(currentChar, currentChar + 1);
    currentChar++;

    // Check if we are at the end of the string.
    if (currentChar == words[currentWord].length) {
      // Clear the original adding interval.
      clearInterval(interval);

      // Reset char index and add 1 to word index.
      currentChar = 0;
      currentWord++;

      // Check if that was the last word. If no looping, disable the carrot permanantly and we are done, else reset word index.
      if (currentWord == words.length) {
        if (!loop) {
          clearInterval(carotInt);
          carotOn.value = false;
          return;
        } // Breaks the loop, no intervals should remain at this time.

        currentWord = 0;
      }

      // Set timeout to clear text after the waiting perioud.
      setTimeout(() => {
        // Clear text with "backspace."
        const subintv = setInterval(() => {
          // Slice away text.
          value.value = value.value.slice(0, -1);

          // When the string is empty again, clear "backspace" interval and start over with next word after waiting period.
          if (value.value.length == 0) {
            clearInterval(subintv);
            setTimeout(createWordInterval, wait);
          }
        }, 50);
      }, wait);
    }
  }, 150);
}

// Start inital typing.
setTimeout(createWordInterval, immediate ? 0 : wait);
</script>

<template>
  <div class="flex flex-row justify-start w-full">
    <span>{{ value }}</span>
    <!-- Set opacity of carot symbol based on carot value. Disable element if it is no longer needed. -->
    <span v-if="carotOn" :class="carot ? 'opacity-100' : 'opacity-0'">|</span>
  </div>
</template>
