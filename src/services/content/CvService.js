import ContentRepository from '@/services/github/ContentRepository.js'

/**
 * CvService - Handles CV file access from public GitHub repository
 * Caching is handled by TanStack Query at the composable layer
 */
class CvService {
  constructor() {
    this.defaultFilename = 'Artem-Verenko-05-2025.pdf'
  }

  /**
   * Get CV download URL
   * @param {string} filename - CV filename (optional)
   * @returns {string} - GitHub raw URL
   */
  getCvUrl(filename = null) {
    const cvFilename = filename || this.defaultFilename
    return ContentRepository.getCvUrl(cvFilename)
  }

  /**
   * Download CV file
   * @param {string} filename - CV filename (optional)
   * @returns {Promise<void>}
   */
  async downloadCv(filename = null) {
    try {
      const url = this.getCvUrl(filename)

      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = filename || this.defaultFilename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download CV:', error)
      throw new Error('Unable to download CV. Please try again later.')
    }
  }

  /**
   * Get CV metadata
   * @returns {Promise<object>} - CV metadata (filename, url, size, etc.)
   */
  async getCvMetadata() {
    const url = this.getCvUrl()

    try {
      const response = await fetch(url, { method: 'HEAD' })
      const size = response.headers.get('content-length')
      const lastModified = response.headers.get('last-modified')

      return {
        filename: this.defaultFilename,
        url,
        size: size ? parseInt(size, 10) : null,
        lastModified: lastModified ? new Date(lastModified) : null,
      }
    } catch (error) {
      console.warn('Could not fetch CV metadata:', error.message)
      return {
        filename: this.defaultFilename,
        url,
        size: null,
        lastModified: null,
      }
    }
  }
}

// Export singleton instance
export default new CvService()
