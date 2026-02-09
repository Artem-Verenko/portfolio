<template>
  <article
    class="book-review-view container mx-auto px-4 py-6 max-w-4xl bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg shadow-lg"
  >
    <!-- Book Review Header -->
    <header class="mb-8">
      <!-- Book Info -->
      <div v-if="book" class="flex items-start gap-6 mb-6">
        <!-- Book Cover -->
        <div v-if="book.cover" class="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg">
          <img :src="bookCoverUrl" :alt="book.title" class="w-full h-full object-cover" />
        </div>

        <!-- Book Metadata -->
        <div class="flex-1">
          <h1 class="text-3xl md:text-4xl font-bold mb-2 text-[var(--text-color)]">
            {{ metadata.title || book.title }}
          </h1>
          <p class="text-xl text-[var(--text-secondary)] mb-3">
            by {{ metadata.author || book.author }}
          </p>

          <!-- Rating -->
          <div v-if="metadata.rating" class="flex items-center gap-2 mb-3">
            <span class="text-sm text-[var(--text-secondary)]">Rating:</span>
            <div class="flex">
              <svg
                v-for="star in 5"
                :key="star"
                class="w-5 h-5"
                :class="star <= metadata.rating ? 'text-[var(--accent-color)]' : 'text-gray-400'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-sm font-semibold">{{ metadata.rating }}/5</span>
          </div>

          <!-- Read Date -->
          <div v-if="metadata.readDate" class="text-sm text-[var(--text-secondary)] mb-3">
            Read: {{ formatDate(metadata.readDate) }}
          </div>

          <!-- Genre -->
          <div v-if="book.genre" class="text-sm text-[var(--text-secondary)]">
            Genre: {{ book.genre }}
          </div>
        </div>
      </div>

      <!-- Summary -->
      <p v-if="metadata.summary" class="text-lg text-[var(--text-secondary)] italic mb-4">
        {{ metadata.summary }}
      </p>

      <!-- Tags -->
      <div v-if="metadata.tags && metadata.tags.length" class="flex gap-2 mb-4">
        <span
          v-for="tag in metadata.tags"
          :key="tag"
          class="px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-xs text-[var(--text-color)]"
        >
          {{ tag }}
        </span>
      </div>

      <div class="border-b border-[var(--border-color)]"></div>
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
        Back to Books
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BookService from '@/services/content/BookService.js'
import { formatDate } from '@/utils/dateFormatter.js'

const router = useRouter()

const props = defineProps({
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
  book: {
    type: Object,
    default: null,
  },
})

const bookCoverUrl = ref(null)

watch(
  () => props.book,
  (book) => {
    if (!book || !book.cover) {
      bookCoverUrl.value = null
      return
    }

    try {
      bookCoverUrl.value = BookService.getBookCoverSrc(book)
    } catch (error) {
      console.warn('Failed to load book cover:', error)
      bookCoverUrl.value = null
    }
  },
  { immediate: true },
)

function goBack() {
  router.push('/books')
}
</script>
