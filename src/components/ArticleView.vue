<template>
  <article
    class="article-view container mx-auto px-4 py-6 max-w-3xl bg-[var(--nav-bg)] backdrop-blur-xl"
  >
    <!-- Article header -->
    <header class="mb-6">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ article.title }}</h1>
      <p class="text-lg text-[var(--text-secondary)] italic">{{ article.summary }}</p>
      <div class="mt-4 border-b border-[var(--border-color)] pb-2"></div>
    </header>

    <!-- Article content blocks -->
    <div class="article-content space-y-6">
      <div
        v-for="(block, index) in article.blocks"
        :key="index"
        class="block"
        :class="{ 'mt-8': block.type === 'subheading' }"
      >
        <!-- Subheading block -->
        <h2
          v-if="block.type === 'subheading'"
          class="text-2xl font-bold mb-3 text-[var(--primary-color)]"
        >
          {{ block.content }}
        </h2>

        <!-- Text paragraph block -->
        <p
          v-else-if="block.type === 'text'"
          class="text-[var(--text-color)] text-lg leading-relaxed"
        >
          {{ block.content }}
        </p>

        <!-- Image block -->
        <figure v-else-if="block.type === 'image'" class="my-6">
          <img
            :src="getImagePath(block)"
            :alt="block.alt || 'Article image'"
            class="rounded-lg shadow-md mx-auto max-h-80 object-contain"
          />
          <figcaption
            v-if="block.caption"
            class="text-center mt-2 text-sm text-[var(--text-secondary)]"
          >
            {{ block.caption }}
          </figcaption>
        </figure>

        <!-- Code block -->
        <pre
          v-else-if="block.type === 'code'"
          class="bg-[var(--bg-card)] rounded-lg p-4 overflow-x-auto font-mono text-sm border border-[var(--border-color)]"
        ><code>{{ block.content }}</code></pre>

        <!-- List block -->
        <ul
          v-else-if="block.type === 'list'"
          class="list-disc pl-6 space-y-2 text-[var(--text-color)]"
        >
          <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
        </ul>

        <!-- Fallback for unrecognized blocks -->
        <div v-else class="text-[var(--text-secondary)] italic">
          Unsupported content block type: {{ block.type }}
        </div>
      </div>
    </div>

    <!-- Back button -->
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

<script>
export default {
  name: 'ArticleView',
  props: {
    article: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        summary: '',
        blocks: [],
      }),
    },
  },
  methods: {
    getImagePath(block) {
      // If the image has a source path, try to load it from assets
      if (block.src) {
        try {
          // Try to resolve the image path dynamically from assets directory
          return new URL(`../assets/${block.src}`, import.meta.url).href
        } catch (error) {
          console.error(`Failed to load image: ${block.src}`, error)
        }
      }

      // Fallback to placeholder if image not found or no src provided
      return new URL(`../assets/placeholder.png`, import.meta.url).href
    },
    goBack() {
      this.$router ? this.$router.back() : window.history.back()
    },
  },
}
</script>

<style scoped>
.article-view {
  font-family: var(--font-sans);
  transition: var(--transition-standard);
}

.article-content p {
  margin-bottom: 1.5rem;
}

/* Add responsive typography */
@media (max-width: 640px) {
  .article-content {
    font-size: 1rem;
  }
}

/* Enhance readability with proper line height and spacing */
.article-content {
  line-height: 1.8;
}

/* Add subtle animations for better UX */
.block {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.block:nth-child(1) {
  animation-delay: 0.1s;
}
.block:nth-child(2) {
  animation-delay: 0.2s;
}
.block:nth-child(3) {
  animation-delay: 0.3s;
}
.block:nth-child(4) {
  animation-delay: 0.4s;
}
.block:nth-child(5) {
  animation-delay: 0.5s;
}
/* Additional delays for more blocks can be added as needed */
</style>
