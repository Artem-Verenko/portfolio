import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import ContentRepository from '@/services/github/ContentRepository.js'
import MarkdownService from '@/services/markdown/MarkdownService.js'
import ImageService from '@/services/content/ImageService.js'
import githubConfig from '@/config/github.config.js'

/**
 * Composable for fetching articles list
 * @returns {object} - Query result with data, loading, error states
 */
export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => ContentRepository.fetchArticles(),
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
    queryFn: async () => {
      const markdown = await ContentRepository.fetchArticleMarkdown(resolvedId.value)
      
      const parsed = await MarkdownService.parseWithFrontmatter(
        markdown,
        `${githubConfig.paths.articles}/${githubConfig.templates.article(resolvedId.value)}`,
      )

      // Merge with articles list metadata if available
      try {
        const articles = await ContentRepository.fetchArticles()
        const articleMeta = articles.find(
          (a) => a.id === resolvedId.value || a.id === String(resolvedId.value)
        )
        if (articleMeta) {
          parsed.metadata = { ...articleMeta, ...parsed.metadata }
        }
      } catch (error) {
        console.warn('Could not fetch article metadata from list:', error.message)
      }

      return {
        metadata: parsed.metadata,
        html: parsed.html,
        rawMarkdown: parsed.rawMarkdown,
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
    queryFn: () => ContentRepository.fetchBooks(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Composable for fetching a single book by ID
 * @param {Ref<string|number>|string|number} id - Book ID
 * @returns {object} - Query result with book data
 */
export function useBook(id) {
  const resolvedId = computed(() => unref(id))

  return useQuery({
    queryKey: computed(() => ['book', resolvedId.value]),
    queryFn: async () => {
      const booksDb = await ContentRepository.fetchBooks()

      for (const genre of booksDb.genres || []) {
        const book = genre.books.find(
          (b) => b.id === resolvedId.value || b.id === Number(resolvedId.value)
        )
        if (book) {
          return { ...book, genre: genre.name }
        }
      }
      return null
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: computed(() => Boolean(resolvedId.value)),
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
    queryFn: async () => {
      const markdown = await ContentRepository.fetchBookReviewMarkdown(resolvedId.value)

      const parsed = await MarkdownService.parseWithFrontmatter(
        markdown,
        `${githubConfig.paths.bookReviews}/${githubConfig.templates.bookReview(resolvedId.value)}`,
      )

      // Get book metadata
      let bookMeta = null
      try {
        const booksDb = await ContentRepository.fetchBooks()
        for (const genre of booksDb.genres || []) {
          const book = genre.books.find(
            (b) => b.id === resolvedId.value || b.id === Number(resolvedId.value)
          )
          if (book) {
            bookMeta = { ...book, genre: genre.name }
            break
          }
        }
      } catch (error) {
        console.warn('Could not fetch book metadata:', error.message)
      }

      return {
        metadata: parsed.metadata,
        html: parsed.html,
        rawMarkdown: parsed.rawMarkdown,
        book: bookMeta,
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
export function useCvUrl(filename = 'Artem-Verenko-CV.pdf') {
  return useQuery({
    queryKey: ['cvUrl', filename],
    queryFn: () => ContentRepository.getCvUrl(filename),
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
      const path = githubConfig.templates.bookCover(currentBook.cover)
      return ImageService.getImageSrc(path)
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
    queryFn: () => ContentRepository.hasBookReview(resolvedId.value),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
    queryFn: async () => {
      const booksDb = await ContentRepository.fetchBooks()
      const booksWithReviews = []
      const pendingChecks = []
      let order = 0

      for (const genre of booksDb.genres || []) {
        for (const book of genre.books) {
          const entry = { book, genreName: genre.name, order: order++ }

          if (book.hasReview) {
            booksWithReviews.push({ ...book, genre: genre.name })
            continue
          }

          pendingChecks.push(entry)
        }
      }

      if (pendingChecks.length === 0) {
        return booksWithReviews
      }

      const checkResults = await Promise.all(
        pendingChecks.map(async (entry) => {
          const hasReview = await ContentRepository.hasBookReview(entry.book.id)
          return { entry, hasReview }
        }),
      )

      checkResults
        .filter(({ hasReview }) => hasReview)
        .sort((a, b) => a.entry.order - b.entry.order)
        .forEach(({ entry }) => {
          booksWithReviews.push({ ...entry.book, genre: entry.genreName })
        })

      return booksWithReviews
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
