<template>
  <section id="book-list" class="container mx-auto px-5 py-24 xl:pt-24">
    <!-- Page Header -->
    <header class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-color)]">
        Recommended Literature
      </h1>
      <p class="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
        A curated collection of books across various genres that have shaped my thinking and
        perspective
      </p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <h2 class="text-2xl font-bold text-[var(--text-color)] mb-4">Failed to load books</h2>
      <p class="text-[var(--text-secondary)]">{{ error.message }}</p>
    </div>

    <!-- Books Content -->
    <div v-else-if="books" class="space-y-16">
      <!-- Genre Sections -->
      <section v-for="genre in books.genres" :key="genre.name" class="genre-section">
        <!-- Genre Header -->
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-2">
            {{ genre.name }}
          </h2>
          <div class="w-24 h-1 bg-[var(--accent-color)] rounded-full"></div>
        </div>

        <!-- Books Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div
            v-for="book in genre.books"
            :key="book.id"
            class="book-card group cursor-pointer"
            :class="{ 'cursor-pointer': book.hasReview }"
            @click="book.hasReview ? viewBookReview(book.id) : null"
          >
            <!-- Book Cover -->
            <div
              class="relative mb-3 overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <div
                class="aspect-[2/3] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg flex items-center justify-center"
              >
                <!-- Real book cover -->
                <img
                  v-if="getBookCover(book)"
                  :src="getBookCover(book)"
                  :alt="book.title"
                  class="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />

                <!-- Placeholder when no cover -->
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                >
                  <div class="text-white text-center p-4">
                    <svg
                      class="w-8 h-8 mx-auto mb-2 opacity-80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xs font-medium opacity-90">
                      {{ book.title.split(' ').slice(0, 2).join(' ') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Book Info -->
            <div class="text-center">
              <h3
                class="text-sm font-semibold text-[var(--text-color)] mb-1 line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors"
              >
                {{ book.title }}
              </h3>
              <p class="text-xs text-[var(--text-secondary)] line-clamp-1">
                {{ book.author }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-bold text-[var(--text-color)] mb-4">No books found</h2>
      <p class="text-[var(--text-secondary)]">
        Books will appear here once they're added to the database.
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBooks } from '@/composables/useContent.js'
import githubConfig from '@/config/github.config.js'
import ImageService from '@/services/content/ImageService.js'
import { PLACEHOLDER_BOOK_COVER } from '@/constants/placeholders.js'

const router = useRouter()
const { data: books, isLoading: loading, error } = useBooks()

const coverImages = reactive({})

watch(
  () => books.value,
  (bookData) => {
    if (!bookData || !bookData.genres) {
      return
    }

    for (const genre of bookData.genres) {
      for (const book of genre.books) {
        if (!book?.id || !book.cover || coverImages[book.id]) {
          continue
        }

        const path = githubConfig.templates.bookCover(book.cover)

        try {
          const src = ImageService.getImageSrc(path)
          coverImages[book.id] = src
        } catch (loadError) {
          console.warn(`Failed to load cover for book ${book.id}:`, loadError)
          coverImages[book.id] = PLACEHOLDER_BOOK_COVER
        }
      }
    }
  },
  { immediate: true },
)

function getBookCover(book) {
  if (!book?.id) {
    return PLACEHOLDER_BOOK_COVER
  }

  if (coverImages[book.id]) {
    return coverImages[book.id]
  }

  return PLACEHOLDER_BOOK_COVER
}

function viewBookReview(id) {
  router.push(`/books/${id}`)
}
</script>
