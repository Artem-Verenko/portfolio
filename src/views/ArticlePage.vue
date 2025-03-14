<template>
  <div class="article-page pt-18">
    <ArticleView v-if="article" :article="article" />
    <div v-else-if="loading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"
      ></div>
    </div>
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-bold text-[var(--text-color)]">Article not found</h2>
      <router-link
        to="/blog"
        class="mt-4 inline-block text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
      >
        Back to Blog
      </router-link>
    </div>
  </div>
</template>

<script>
import ArticleView from '@/components/ArticleView.vue'

export default {
  name: 'ArticlePage',
  components: {
    ArticleView,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      article: null,
      loading: true,
    }
  },
  created() {
    this.loadArticle()
  },
  watch: {
    id() {
      this.loadArticle()
    },
  },
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        // Завантаження статті з папки public/articles
        const response = await fetch(`public/articles/article${this.id}.json`)
        if (!response.ok) {
          throw new Error('Article not found')
        }
        this.article = await response.json()
      } catch (error) {
        console.error(error)
        this.article = null
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
