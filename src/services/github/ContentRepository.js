import githubConfig from '@/config/github.config.js'

/**
 * ContentRepository - Handles content fetching from public GitHub repository
 * Uses GitHub raw URLs for direct file access without API authentication
 */
class ContentRepository {
  /**
   * Fetch articles manifest
   * @returns {Promise<Array>} - List of article metadata
   */
  async fetchArticles() {
    const response = await fetch(githubConfig.getRawUrl(githubConfig.paths.articlesManifest))
    if (!response.ok) {
      throw new Error('Unable to load articles. Please try again later.')
    }
    return await response.json()
  }

  /**
   * Fetch article markdown content
   * @param {string|number} id - Article ID
   * @returns {Promise<string>} - Raw markdown content
   */
  async fetchArticleMarkdown(id) {
    const path = `${githubConfig.paths.articles}/${githubConfig.templates.article(id)}`
    const response = await fetch(githubConfig.getRawUrl(path))
    if (!response.ok) {
      throw new Error('Unable to load article. Please try again later.')
    }
    return await response.text()
  }

  /**
   * Fetch books database
   * @returns {Promise<object>} - Books database with genres
   */
  async fetchBooks() {
    const response = await fetch(githubConfig.getRawUrl(githubConfig.paths.booksDatabase))
    if (!response.ok) {
      throw new Error('Unable to load books. Please try again later.')
    }
    return await response.json()
  }

  /**
   * Fetch book review markdown content
   * @param {string|number} id - Book ID
   * @returns {Promise<string>} - Raw markdown content
   */
  async fetchBookReviewMarkdown(id) {
    const path = `${githubConfig.paths.bookReviews}/${githubConfig.templates.bookReview(id)}`
    const response = await fetch(githubConfig.getRawUrl(path))
    if (!response.ok) {
      throw new Error('Unable to load book review. Please try again later.')
    }
    return await response.text()
  }

  /**
   * Check if book has a review
   * @param {string|number} id - Book ID
   * @returns {Promise<boolean>}
   */
  async hasBookReview(id) {
    try {
      const path = `${githubConfig.paths.bookReviews}/${githubConfig.templates.bookReview(id)}`
      const response = await fetch(githubConfig.getRawUrl(path), { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error(`Failed to check book review ${id}:`, error)
      return false
    }
  }

  /**
   * Get CV file URL
   * @param {string} filename - CV filename (default: Artem-Verenko-CV.pdf)
   * @returns {string} - GitHub raw URL to CV
   */
  getCvUrl(filename = 'Artem-Verenko-CV.pdf') {
    return githubConfig.getRawUrl(`${githubConfig.paths.cv}/${filename}`)
  }

  /**
   * Fetch file content by path
   * @param {string} path - Path to file
   * @returns {Promise<string>}
   */
  async fetchFileContent(path) {
    const response = await fetch(githubConfig.getRawUrl(path))
    if (!response.ok) {
      throw new Error('Unable to load file. Please try again later.')
    }
    return await response.text()
  }

  /**
   * Get image URL from repository
   * @param {string} path - Path to image in repository
   * @returns {string} - GitHub raw URL to image
   */
  getImageUrl(path) {
    return githubConfig.getRawUrl(path)
  }
}

// Export singleton instance
export default new ContentRepository()
