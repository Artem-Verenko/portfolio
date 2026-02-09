<template>
  <article
    class="article-view container mx-auto px-4 py-6 max-w-4xl bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg shadow-lg"
  >
    <!-- Article Header -->
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-color)]">
        {{ metadata.title }}
      </h1>
      <div class="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
        <span v-if="metadata.date">{{ formatDate(metadata.date) }}</span>
        <span v-if="metadata.tags && metadata.tags.length" class="flex gap-2">
          <span
            v-for="tag in metadata.tags"
            :key="tag"
            class="px-2 py-1 bg-[var(--bg-secondary)] rounded text-xs"
          >
            {{ tag }}
          </span>
        </span>
      </div>
      <p v-if="metadata.summary" class="text-lg text-[var(--text-secondary)] italic">
        {{ metadata.summary }}
      </p>
      <div class="mt-4 border-b border-[var(--border-color)]"></div>
    </header>

    <!-- Markdown Content -->
    <div class="markdown-body" v-html="htmlContent"></div>

    <!-- Back Button -->
    <div class="mt-10 pt-4 border-t border-[var(--border-color)]">
      <button
        @click="goBack"
        class="flex items-center text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Articles
      </button>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dateFormatter.js'

const router = useRouter()

defineProps({
  metadata: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  htmlContent: {
    type: String,
    required: true,
    default: '',
  },
})

function goBack() {
  router.back()
}
</script>
