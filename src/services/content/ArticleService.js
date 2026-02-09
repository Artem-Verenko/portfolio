import ContentRepository from '@/services/github/ContentRepository.js'
import MarkdownService from '@/services/markdown/MarkdownService.js'
import githubConfig from '@/config/github.config.js'

/**
 * ArticleService - Handles article fetching and parsing
 * Caching is handled by TanStack Query at the composable layer
 */
class ArticleService {
  /**
   * Get all articles
   * @returns {Promise<Array>} - List of article metadata
   */
  async getArticles() {
    // Fetch from GitHub - caching handled by TanStack Query
    const articles = await ContentRepository.fetchArticles()
    return articles
  }

  /**
   * Get single article by ID
   * @param {string|number} id - Article ID
   * @returns {Promise<{metadata: object, html: string, rawMarkdown: string}>}
   */
  async getArticle(id) {
    // Fetch markdown from GitHub - caching handled by TanStack Query
    const markdown = await ContentRepository.fetchArticleMarkdown(id)

    // Parse markdown with frontmatter
    const parsed = await MarkdownService.parseWithFrontmatter(
      markdown,
      `${githubConfig.paths.articles}/${githubConfig.templates.article(id)}`,
    )

    // Also get metadata from articles list if available
    try {
      const articles = await this.getArticles()
      const articleMeta = articles.find((a) => a.id === id || a.id === String(id))
      if (articleMeta) {
        parsed.metadata = { ...articleMeta, ...parsed.metadata }
      }
    } catch (error) {
      console.warn('Could not fetch article metadata from list:', error.message)
    }

    const result = {
      metadata: parsed.metadata,
      html: parsed.html,
      rawMarkdown: parsed.rawMarkdown,
    }

    return result
  }

  /**
   * Preload articles (useful for initial page load)
   * @param {number} count - Number of articles to preload
   */
  async preloadArticles(count = 3) {
    try {
      const articles = await this.getArticles()
      const articlesToPreload = articles.slice(0, count)

      const preloadPromises = articlesToPreload.map((article) =>
        this.getArticle(article.id).catch((error) => {
          console.warn(`Failed to preload article ${article.id}:`, error)
        }),
      )

      await Promise.all(preloadPromises)
    } catch (error) {
      console.warn('Failed to preload articles:', error)
    }
  }
}

// Export singleton instance
export default new ArticleService()
