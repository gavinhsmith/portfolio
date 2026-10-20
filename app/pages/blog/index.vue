<script setup>
const { data: articles, error } = await useFetch("/api/blog");
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto">
      <ComputerAppContainer title="~/blog" icon="tabler:notebook">
        <div class="bg-honeydew text-ink-black text-xs md:text-sm font-mono">
          <NuxtLink
            v-for="a in articles"
            :key="a.path"
            :to="a.path"
            class="grid grid-cols-[1fr_auto] gap-4 px-4 py-1.5 hover:bg-alabaster-grey/60"
          >
            <span class="flex items-center gap-2 min-w-0">
              <Icon name="tabler:file-text" class="shrink-0 text-prussian-blue" />
              <span class="truncate">{{ a.title }}</span>
            </span>
            <span class="opacity-70 whitespace-nowrap">{{
              fmtDate(`${a.date}T12:00`)
            }}</span>
          </NuxtLink>
          <p v-if="!articles.length" class="px-4 py-2 italic opacity-70">
            Nothing here yet.
          </p>
        </div>
      </ComputerAppContainer>
    </div>
  </div>
</template>
