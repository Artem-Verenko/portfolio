import githubConfig from '@/config/github.config.js'

const CV_PREFIX = 'Artem-Verenko'
const CV_DEFAULT_FILENAME = 'Artem-Verenko-05-2025.pdf'

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
   * Get CV file URL (no lookup, direct)
   * @param {string} filename - CV filename
   * @returns {string} - GitHub raw URL to CV
   */
  getCvUrl(filename) {
    return githubConfig.getRawUrl(`${githubConfig.paths.cv}/${filename}`)
  }

  /**
   * Resolve latest CV filename by prefix; falls back to default on any failure.
   * @param {string} prefix - Filename prefix to match
   * @returns {Promise<string>} - Resolved filename
   */
  async getLatestCvFilename(prefix = CV_PREFIX) {
    try {
      const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.paths.cv}?ref=${githubConfig.branch}`
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error(`GitHub API responded ${response.status}`)

      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Unexpected GitHub API response')

      const candidates = data
        .filter((item) => item.type === 'file' && item.name.startsWith(prefix) && item.name.toLowerCase().endsWith('.pdf'))
        .map((item) => item.name)
        .sort()

      return candidates[candidates.length - 1] || CV_DEFAULT_FILENAME
    } catch (error) {
      console.warn('Falling back to default CV filename:', error.message)
      return CV_DEFAULT_FILENAME
    }
  }

  /**
   * Resolve a CV URL, optionally using a specific filename. If no filename provided,
   * tries to find the latest by prefix, otherwise falls back to default.
   * @param {string|null} filename - CV filename override
   * @returns {Promise<string>} - Resolved raw URL
   */
  async getResolvedCvUrl(filename = null) {
    const resolvedName = filename || (await this.getLatestCvFilename())
    return this.getCvUrl(resolvedName)
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
