import githubConfig from '@/config/github.config.js'

/**
 * ImageService - Handles image URL generation from public GitHub repository
 * Returns raw GitHub URLs for direct browser caching
 */
class ImageService {
  /**
   * Get image source for use in <img src=""> attributes
   * @param {string} path - Repository-relative path to the image
   * @returns {string} - Raw GitHub URL
   */
  getImageSrc(path) {
    if (!path) {
      return ''
    }

    const normalizedPath = path.replace(/^\/+/, '')
    return githubConfig.getRawUrl(normalizedPath)
  }
}

export default new ImageService()
