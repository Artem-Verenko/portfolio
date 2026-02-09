import MarkdownService from '@/services/markdown/MarkdownService.js'
import githubConfig from '@/config/github.config.js'
import ImageService from '@/services/content/ImageService.js'
import ContentRepository from '@/services/github/ContentRepository.js'

/**
 * BookService - Handles book database and review fetching and parsing
 * Caching is handled by TanStack Query at the composable layer
 */
class BookService {
  /**
   * Get books database
   * @returns {Promise<object>} - Books database with genres
   */
  async getBooks() {
    // Fetch from GitHub - caching handled by TanStack Query
    const booksDb = await ContentRepository.fetchBooks()
    return booksDb
  }

  /**
   * Get book by ID from database
   * @param {string|number} id - Book ID
   * @returns {Promise<object|null>} - Book metadata or null if not found
   */
  async getBook(id) {
    const booksDb = await this.getBooks()

    for (const genre of booksDb.genres || []) {
      const book = genre.books.find((b) => b.id === id || b.id === Number(id))
      if (book) {
        return { ...book, genre: genre.name }
      }
    }

    return null
  }

  /**
   * Get book review by ID
   * @param {string|number} id - Book ID
   * @returns {Promise<{metadata: object, html: string, rawMarkdown: string, book: object}>}
   */
  async getBookReview(id) {
    // Fetch markdown from GitHub - caching handled by TanStack Query
    const markdown = await ContentRepository.fetchBookReviewMarkdown(id)

    // Parse markdown with frontmatter
    const parsed = await MarkdownService.parseWithFrontmatter(
      markdown,
      `${githubConfig.paths.bookReviews}/${githubConfig.templates.bookReview(id)}`,
    )

    // Get book metadata from database
    let bookMeta = null
    try {
      bookMeta = await this.getBook(id)
    } catch (error) {
      console.warn('Could not fetch book metadata:', error.message)
    }

    const result = {
      metadata: parsed.metadata,
      html: parsed.html,
      rawMarkdown: parsed.rawMarkdown,
      book: bookMeta,
    }

    return result
  }

  /**
   * Check if book has a review
   * @param {string|number} id - Book ID
   * @returns {Promise<boolean>}
   */
  async hasReview(id) {
    // TanStack Query handles caching
    return await ContentRepository.hasBookReview(id)
  }

  /**
   * Get all books with reviews
   * @returns {Promise<Array>} - List of books that have reviews
   */
  async getBooksWithReviews() {
    const booksDb = await this.getBooks()
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
        const hasReview = await this.hasReview(entry.book.id)
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
  }

  /**
   * Get book cover URL
   * @param {object} book - Book object with cover property
   * @returns {string|null} - GitHub raw URL to cover image
   */
  getBookCoverSrc(book) {
    if (!book || !book.cover) {
      return null
    }

    const path = githubConfig.templates.bookCover(book.cover)
    return ImageService.getImageSrc(path)
  }
}

// Export singleton instance
export default new BookService()
