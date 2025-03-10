<template>
  <div class="mb-6">
    <!-- Render block based on its type -->
    <template v-if="block.type === 'text'">
      <p class="text-base leading-relaxed text-gray-800 dark:text-gray-200">{{ block.content }}</p>
    </template>
    <template v-else-if="block.type === 'subheading'">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ block.content }}
      </h2>
    </template>
    <template v-else-if="block.type === 'image'">
      <img :src="block.src" :alt="block.alt" class="w-full h-auto rounded shadow" />
    </template>
    <template v-else>
      <div>{{ block.content }}</div>
    </template>
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
