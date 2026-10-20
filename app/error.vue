<script setup>
const props = defineProps({ error: Object });

const code = computed(() => props.error?.statusCode ?? 500);
const notFound = computed(() => code.value === 404);
const message = computed(() =>
  notFound.value
    ? "No such file or directory"
    : props.error?.statusMessage || props.error?.message || "Something went wrong",
);
const path = useRoute().path;

useHead({ title: () => `${code.value} | Gavin Smith` });

// clearError resets Nuxt's error state; a plain link would leave this page up.
const goHome = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28 flex">
      <div class="w-full max-w-xl m-auto">
        <ComputerAppContainer title="error.log" icon="tabler:alert-triangle">
          <div
            class="p-4 flex flex-col gap-1 bg-ink-black text-porcelain text-xs md:text-sm font-mono"
          >
            <p class="opacity-60 break-all">$ open {{ path }}</p>
            <p class="text-harvest-orange break-all">
              error {{ code }}: {{ message }}
            </p>
            <h1 class="mt-4 font-serif italic text-5xl md:text-6xl text-golden-glow">
              {{ code }}
            </h1>
            <p class="opacity-80">
              {{
                notFound
                  ? "That page doesn't exist, or it moved."
                  : "The server tripped over something. Try again in a moment."
              }}
            </p>
            <div class="mt-4 flex gap-4">
              <button
                type="button"
                class="flex items-center gap-1.5 hover:underline cursor-pointer"
                @click="goHome"
              >
                <Icon name="tabler:home" /> cd ~
              </button>
            </div>
          </div>
        </ComputerAppContainer>
      </div>
    </div>
  </NuxtLayout>
</template>
