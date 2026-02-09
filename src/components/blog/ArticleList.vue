<template>
  <section id="article-list" class="container mx-auto px-5 py-24 xl:pt-24">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <h2 class="text-2xl font-bold text-[var(--text-color)] mb-4">Failed to load articles</h2>
      <p class="text-[var(--text-secondary)]">{{ error.message }}</p>
    </div>

    <!-- Articles List -->
    <div v-else class="space-y-6">
      <article
        v-for="article in sortedArticles"
        :key="article.id"
        @click="viewArticle(article.id)"
        class="cursor-pointer border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg p-0 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-2xl flex flex-col md:flex-row"
      >
        <!-- Preview Image Section -->
        <div
          v-if="article.previewImage"
          class="relative md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
        >
          <img
            :src="getArticleImage(article)"
            :alt="article.title"
            class="object-contain max-h-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
        <!-- Article Content Section -->
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

      <!-- Empty State -->
      <div v-if="!sortedArticles || sortedArticles.length === 0" class="text-center py-12">
        <p class="text-lg text-[var(--text-secondary)]">No articles found</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles } from '@/composables/useContent.js'
import githubConfig from '@/config/github.config.js'
import ImageService from '@/services/content/ImageService.js'
import { formatDate } from '@/utils/dateFormatter.js'
import { PLACEHOLDER_IMAGE } from '@/constants/placeholders.js'

const router = useRouter()
const { data: articles, isLoading, error } = useArticles()

const previewImages = reactive({})

watch(
  () => articles.value,
  async (articleList) => {
    if (!articleList || !Array.isArray(articleList)) {
      return
    }

    for (const article of articleList) {
      if (!article?.previewImage || previewImages[article.id]) {
        continue
      }

      const path = githubConfig.templates.articleImage(article.previewImage)

      try {
        const src = ImageService.getImageSrc(path)
        previewImages[article.id] = src
      } catch (loadError) {
        console.warn(`Failed to load preview image for article ${article.id}:`, loadError)
        previewImages[article.id] = PLACEHOLDER_IMAGE
      }
    }
  },
  { immediate: true },
)

const sortedArticles = computed(() => {
  if (!articles.value) return []
  return [...articles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

function getArticleImage(article) {
  if (!article?.id) {
    return PLACEHOLDER_IMAGE
  }

  const imageSrc = previewImages[article.id]

  if (imageSrc) {
    return imageSrc
  }

  // Return placeholder while async image loads
  return PLACEHOLDER_IMAGE
}

function viewArticle(id) {
  router.push(`/blog/articles/${id}`)
}
</script>
