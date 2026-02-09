import { useQueryClient } from '@tanstack/vue-query'
import ContentRepository from '@/services/github/ContentRepository.js'
import MarkdownService from '@/services/markdown/MarkdownService.js'
import githubConfig from '@/config/github.config.js'

/**
 * Prefetch utilities for optimizing route transitions
 */

/**
 * Prefetch articles list
 */
export async function prefetchArticles(queryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['articles'],
    queryFn: () => ContentRepository.fetchArticles(),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Prefetch a specific article by ID
 */
export async function prefetchArticle(queryClient, id) {
  await queryClient.prefetchQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const markdown = await ContentRepository.fetchArticleMarkdown(id)

      const parsed = await MarkdownService.parseWithFrontmatter(
        markdown,
        `${githubConfig.paths.articles}/${githubConfig.templates.article(id)}`,
      )

      try {
        const articles = await ContentRepository.fetchArticles()
        const articleMeta = articles.find((a) => a.id === id || a.id === String(id))
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
  })
}

/**
 * Prefetch books database
 */
export async function prefetchBooks(queryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['books'],
    queryFn: () => ContentRepository.fetchBooks(),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Prefetch a specific book review by ID
 */
export async function prefetchBookReview(queryClient, id) {
  await queryClient.prefetchQuery({
    queryKey: ['bookReview', id],
    queryFn: async () => {
      const markdown = await ContentRepository.fetchBookReviewMarkdown(id)

      const parsed = await MarkdownService.parseWithFrontmatter(
        markdown,
        `${githubConfig.paths.bookReviews}/${githubConfig.templates.bookReview(id)}`,
      )

      let bookMeta = null
      try {
        const booksDb = await ContentRepository.fetchBooks()
        for (const genre of booksDb.genres || []) {
          const book = genre.books.find((b) => b.id === id || b.id === Number(id))
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
  })
}

/**
 * Setup router prefetching
 * Call this in your router configuration
 */
export function setupPrefetching(router) {
  router.beforeEach((to, from, next) => {
    const queryClient = useQueryClient()

    // Prefetch based on route
    if (to.name === 'Blog') {
      prefetchArticles(queryClient).catch(console.error)
    } else if (to.name === 'ArticlePage' && to.params.id) {
      prefetchArticle(queryClient, to.params.id).catch(console.error)
    } else if (to.name === 'Books') {
      prefetchBooks(queryClient).catch(console.error)
    } else if (to.name === 'BookReviewPage' && to.params.id) {
      prefetchBookReview(queryClient, to.params.id).catch(console.error)
    }

    next()
  })
}
