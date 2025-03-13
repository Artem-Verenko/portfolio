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
const articleFiles = import.meta.glob('@/assets/data/articles/*.json', { eager: true })

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
  computed: {
    articles() {
      return Object.values(articleFiles).reduce((acc, module) => {
        acc[module.default.id] = module.default
        return acc
      }, {})
    },
    article() {
      return this.articles[this.id]
    },
  },
}
</script>
