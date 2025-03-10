<template>
  <section id="article-list" class="container mx-auto px-5 py-24 xl:pt-24">
    <div class="space-y-6">
      <article
        v-for="article in articles"
        :key="article.id"
        @click="viewArticle(article.id)"
        class="cursor-pointer border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg p-0 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-2xl flex flex-col md:flex-row"
      >
        <!-- Left section with image preview -->
        <div
          class="relative md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
        >
          <img
            :src="getArticleImage(article.id)"
            :alt="article.title"
            class="object-contain max-h-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
        <!-- Right section with article details -->
        <div class="p-6 flex-1">
          <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
          <p class="text-sm text-[var(--text-secondary)] mb-3">{{ formatDate(article.date) }}</p>
          <p class="text-sm">{{ article.summary }}</p>
          <div class="mt-4">
            <button
              class="text-[var(--accent-color)] hover:text-[var(--accent-hover)] text-sm font-semibold"
            >
              Read more →
            </button>
          </div>
        </div>
      </article>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-color)]"
        ></div>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && articles.length === 0" class="text-center py-12">
        <p class="text-lg text-[var(--text-secondary)]">No articles found</p>
      </div>
    </div>
  </section>
</template>

<script>
// Use dynamic imports for articles
const articleFiles = import.meta.glob('@/assets/data/articles/*.json', { eager: true })

export default {
  name: 'ArticleList',
  data() {
    return {
      articles: [],
      isLoading: true,
    }
  },
  mounted() {
    // Simulate loading articles from an API
    setTimeout(() => {
      this.loadArticles()
      this.isLoading = false
    }, 1)
  },
  methods: {
    loadArticles() {
      // Map the dynamically imported articles to our format
      const articles = Object.values(articleFiles).map((module) => {
        return {
          ...module.default,
          // Add a default date if not present
          date: module.default.date ? new Date(module.default.date) : new Date(),
        }
      })

      // Sort articles by date (newest first)
      this.articles = articles.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    getArticleImage(id) {
      // Find the article by id
      const article = this.articles.find((a) => a.id.toString() === id.toString())

      if (article && article['preview-image']) {
        try {
          // Try to resolve the image path dynamically
          return new URL(`../assets/${article['preview-image']}`, import.meta.url).href
        } catch (error) {
          console.error(`Failed to load preview image for article ${id}:`, error)
        }
      }

      // Return placeholder if image not found
      return new URL('../assets/placeholder.png', import.meta.url).href
    },
    formatDate(date) {
      if (!date) return ''
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString(undefined, options)
    },
    viewArticle(id) {
      // Navigate to article view with article ID
      this.$router.push(`/blog/articles/${id}`)
    },
  },
}
</script>

<style scoped>
article {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

article:nth-child(1) {
  animation-delay: 0.1s;
}
article:nth-child(2) {
  animation-delay: 0.2s;
}
article:nth-child(3) {
  animation-delay: 0.3s;
}
article:nth-child(4) {
  animation-delay: 0.4s;
}
article:nth-child(5) {
  animation-delay: 0.5s;
}
</style>
