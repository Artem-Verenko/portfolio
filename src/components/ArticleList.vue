<template>
  <section id="article-list" class="container mx-auto px-5 py-24 xl:pt-24">
    <div class="space-y-6">
      <article
        v-for="article in sortedArticles"
        :key="article.id"
        @click="viewArticle(article.id)"
        class="cursor-pointer border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg p-0 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-2xl flex flex-col md:flex-row"
      >
        <div
          class="relative md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
        >
          <img
            :src="getArticleImage(article.id)"
            :alt="article.title"
            class="object-contain max-h-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
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

      <div v-if="!sortedArticles.length" class="text-center py-12">
        <p class="text-lg text-[var(--text-secondary)]">No articles found</p>
      </div>
    </div>
  </section>
</template>

<script>
const articleFiles = import.meta.glob('@/assets/data/articles/*.json', { eager: true })

export default {
  name: 'ArticleList',
  computed: {
    sortedArticles() {
      const articles = Object.values(articleFiles).map((module) => ({
        ...module.default,
        date: module.default.date ? new Date(module.default.date) : new Date(),
      }))
      return articles.sort((a, b) => b.date - a.date)
    },
  },
  methods: {
    getArticleImage(id) {
      const article = this.sortedArticles.find((a) => a.id.toString() === id.toString())
      if (article && article['preview-image']) {
        try {
          return new URL(`../assets/${article['preview-image']}`, import.meta.url).href
        } catch (error) {
          console.error(`Failed to load preview image for article ${id}:`, error)
        }
      }
      return new URL('../assets/placeholder.png', import.meta.url).href
    },
    formatDate(date) {
      if (!date) return ''
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString(undefined, options)
    },
    viewArticle(id) {
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
