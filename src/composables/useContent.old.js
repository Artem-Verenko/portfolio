import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import ArticleService from '@/services/content/ArticleService.js'
import BookService from '@/services/content/BookService.js'
import CvService from '@/services/content/CvService.js'

/**
 * Composable for fetching articles list
 * @returns {object} - Query result with data, loading, error states
 */
export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => ArticleService.getArticles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Composable for fetching a single article
 * @param {Ref<string|number>|string|number} id - Article ID (can be a ref or value)
 * @returns {object} - Query result with article data
 */
export function useArticle(id) {
  const resolvedId = computed(() => unref(id))

  return useQuery({
    queryKey: computed(() => ['article', resolvedId.value]),
    queryFn: () => ArticleService.getArticle(resolvedId.value),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: computed(() => Boolean(resolvedId.value)),
  })
}

/**
 * Composable for fetching books database
 * @returns {object} - Query result with books data
 */
export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => BookService.getBooks(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Composable for fetching a single book review
 * @param {Ref<string|number>|string|number} id - Book ID (can be a ref or value)
 * @returns {object} - Query result with book review data
 */
export function useBookReview(id) {
  const resolvedId = computed(() => unref(id))

  return useQuery({
    queryKey: computed(() => ['bookReview', resolvedId.value]),
    queryFn: () => BookService.getBookReview(resolvedId.value),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: computed(() => Boolean(resolvedId.value)),
  })
}

/**
 * Composable for fetching CV URL
 * @param {string} filename - CV filename (optional)
 * @returns {object} - Query result with CV URL
 */
export function useCvUrl(filename = null) {
  return useQuery({
    queryKey: ['cvUrl', filename],
    queryFn: () => CvService.getCvUrl(filename),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Composable for getting book cover URL
 * @param {Ref<object>|object} book - Book object or ref to book object
 * @returns {object} - Query result with book cover URL
 */
export function useBookCoverUrl(book) {
  const resolvedBook = computed(() => unref(book))
  const resolvedId = computed(() => resolvedBook.value?.id ?? null)
  const hasCover = computed(() => Boolean(resolvedBook.value?.cover))

  return useQuery({
    queryKey: computed(() => ['bookCover', resolvedId.value]),
    queryFn: () => {
      const currentBook = resolvedBook.value
      if (!currentBook || !currentBook.cover) {
        return null
      }
      return BookService.getBookCoverSrc(currentBook)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: computed(() => Boolean(resolvedId.value && hasCover.value)),
  })
}

/**
 * Composable for checking if a book has a review
 * @param {Ref<string|number>|string|number} id - Book ID
 * @returns {object} - Query result with boolean
 */
export function useHasBookReview(id) {
  const resolvedId = computed(() => unref(id))

  return useQuery({
    queryKey: computed(() => ['hasBookReview', resolvedId.value]),
    queryFn: () => BookService.hasReview(resolvedId.value),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    enabled: computed(() => Boolean(resolvedId.value)),
  })
}

/**
 * Composable for getting books with reviews
 * @returns {object} - Query result with books that have reviews
 */
export function useBooksWithReviews() {
  return useQuery({
    queryKey: ['booksWithReviews'],
    queryFn: () => BookService.getBooksWithReviews(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
