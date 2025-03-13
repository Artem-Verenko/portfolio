<template>
  <div class="mb-6">
    <p
      v-if="block.type === 'text'"
      class="text-base leading-relaxed text-gray-800 dark:text-gray-200"
    >
      {{ block.content }}
    </p>
    <h2
      v-else-if="block.type === 'subheading'"
      class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
    >
      {{ block.content }}
    </h2>
    <img
      v-else-if="block.type === 'image'"
      :src="block.src"
      :alt="block.alt"
      class="w-full h-auto rounded shadow"
    />
    <div v-else>
      {{ block.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleBlock',
  props: {
    block: {
      type: Object,
      required: true,
    },
  },
}
</script>
