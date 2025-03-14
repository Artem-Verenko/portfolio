<template>
  <section id="article-list" class="container mx-auto px-5 py-24 xl:pt-24">
    <div class="space-y-6">
      <article
        v-for="article in sortedArticles"
        :key="article.id"
        @click="viewArticle(article.id)"
        class="cursor-pointer border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg p-0 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-2xl flex flex-col md:flex-row"
      >
        <!-- Ліва секція з прев'ю зображення -->
        <div
          class="relative md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
        >
          <img
            :src="getArticleImage(article)"
            :alt="article.title"
            class="object-contain max-h-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
        <!-- Права секція з даними статті -->
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

      <!-- Повідомлення, якщо статті відсутні -->
      <div v-if="!sortedArticles.length" class="text-center py-12">
        <p class="text-lg text-[var(--text-secondary)]">No articles found</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArticleList',
  data() {
    return {
      // Список статей завантажується з маніфесту
      articles: [],
    }
  },
  computed: {
    sortedArticles() {
      return this.articles.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
  },
  created() {
    this.loadArticles()
  },
  methods: {
    async loadArticles() {
      try {
        // Завантажуємо маніфест із статтями (public/articles/articles.json)
        const response = await fetch('public/articles/articles.json')
        if (!response.ok) {
          throw new Error('Failed to load articles manifest')
        }
        this.articles = await response.json()
      } catch (error) {
        console.error(error)
        this.articles = []
      }
    },
    getArticleImage(article) {
      // Припускаємо, що стаття містить поле previewImage з ім'ям файлу зображення
      if (article.previewImage) {
        return `public/articles/${article.previewImage}`
      }
      // Запасний варіант — використання placeholder
      return '/assets/placeholder.png'
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
