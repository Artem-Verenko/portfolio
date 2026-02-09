<template>
  <div class="book-review-page pt-18">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <h2 class="text-2xl font-bold text-[var(--text-color)]">Book review not found</h2>
      <p class="text-[var(--text-secondary)] mt-2">{{ error.message }}</p>
      <router-link
        to="/books"
        class="mt-4 inline-block text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
      >
        Back to Books
      </router-link>
    </div>

    <!-- Book Review Content -->
    <BookReviewView
      v-else-if="review"
      :metadata="review.metadata"
      :html-content="review.html"
      :book="review.book"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BookReviewView from '@/components/books/BookReviewView.vue'
import { useBookReview } from '@/composables/useContent.js'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const { data: review, isLoading, error } = useBookReview(computed(() => props.id))
</script>
