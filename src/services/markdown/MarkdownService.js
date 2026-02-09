import MarkdownIt from 'markdown-it'
import githubConfig from '@/config/github.config.js'

/**
 * MarkdownService - Handles markdown parsing and image path resolution
 * Converts markdown content to HTML with GitHub raw URL support for images
 */
class MarkdownService {
  /**
   * Create a new MarkdownIt instance with custom image renderer
   * @private
   * @param {string} basePath - Base path for resolving relative images
   * @returns {MarkdownIt} - Configured MarkdownIt instance
   */
  _createMarkdownInstance(basePath = '') {
    const md = new MarkdownIt({
      html: true, // Enable HTML tags in source
      linkify: true, // Auto-convert URLs to links
      typographer: true, // Enable smart quotes and other typographic replacements
      breaks: false, // Convert \n to <br>
    })

    const baseImageUrl = basePath
      ? `https://raw.githubusercontent.com/${githubConfig.owner}/${githubConfig.repo}/${githubConfig.branch}/${basePath}`
      : ''

    const defaultImageRender =
      md.renderer.rules.image ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const srcIndex = token.attrIndex('src')

      if (srcIndex >= 0) {
        const src = token.attrs[srcIndex][1]

        // Resolve relative paths to GitHub raw URLs
        if (this._isRelativePath(src)) {
          const resolvedSrc = this._resolveImagePath(src, basePath, baseImageUrl)
          token.attrs[srcIndex][1] = resolvedSrc
        }
      }

      return defaultImageRender(tokens, idx, options, env, self)
    }

    return md
  }

  /**
   * Parse markdown content to HTML
   * @param {string} content - Raw markdown content
   * @param {string} contentPath - Path to the content file (for resolving relative images)
   * @returns {string} - Parsed HTML
   */
  parseMarkdown(content, contentPath = '') {
    if (!content) return ''

    // Get base path for images from the content path
    const basePath = this._getBasePath(contentPath)

    // Create a new instance for this parse operation
    const md = this._createMarkdownInstance(basePath)

    // Parse markdown to HTML
    return md.render(content)
  }

  /**
   * Parse markdown with frontmatter
   * Extracts YAML frontmatter and returns both metadata and HTML content
   * @param {string} content - Raw markdown content with optional frontmatter
   * @param {string} contentPath - Path to the content file
   * @returns {Promise<{metadata: object, html: string, rawMarkdown: string}>}
   */
  async parseWithFrontmatter(content, contentPath = '') {
    if (!content) {
      return { metadata: {}, html: '', rawMarkdown: '' }
    }

    const { metadata, markdown } = this._extractFrontmatter(content)
    const html = this.parseMarkdown(markdown, contentPath)

    return {
      metadata,
      html,
      rawMarkdown: markdown,
    }
  }

  /**
   * Extract YAML frontmatter from markdown content
   * @private
   */
  _extractFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/

    const match = content.match(frontmatterRegex)

    if (!match) {
      return { metadata: {}, markdown: content }
    }

    const yamlContent = match[1]
    const markdown = match[2]

    const metadata = this._parseYaml(yamlContent)

    return { metadata, markdown }
  }

  /**
   * Simple browser-compatible YAML parser for frontmatter
   * Handles common frontmatter patterns without Node.js dependencies
   * @private
   */
  _parseYaml(yaml) {
    const lines = yaml.split('\n')
    const result = {}
    let currentKey = null
    let currentArray = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue

      // Check for array items
      if (trimmed.startsWith('-')) {
        if (currentArray) {
          const value = trimmed.substring(1).trim()
          currentArray.push(this._parseValue(value))
        }
        continue
      }

      // Check for key-value pairs
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) continue

      const key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      // Start of array
      if (!value || value === '') {
        // Look ahead to see if next line is an array item
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('-')) {
          currentKey = key
          currentArray = []
          result[key] = currentArray
          continue
        }
      } else {
        currentArray = null
        currentKey = null
      }

      result[key] = this._parseValue(value)
    }

    return result
  }

  /**
   * Parse a YAML value (string, number, boolean, array)
   * @private
   */
  _parseValue(value) {
    if (!value) return ''

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1)
    }

    // Parse inline arrays [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      return value
        .slice(1, -1)
        .split(',')
        .map((v) => this._parseValue(v.trim()))
    }

    // Parse booleans
    if (value === 'true') return true
    if (value === 'false') return false

    // Parse numbers
    if (!isNaN(value) && value !== '') {
      return Number(value)
    }

    return value
  }

  /**
   * Check if a path is relative
   * @private
   */
  _isRelativePath(path) {
    return (
      path.startsWith('./') ||
      path.startsWith('../') ||
      (!path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('/'))
    )
  }

  /**
   * Get the base path from content path (directory containing the file)
   * @private
   */
  _getBasePath(contentPath) {
    if (!contentPath) return ''
    const parts = contentPath.split('/')
    parts.pop() // Remove filename
    return parts.join('/')
  }

  /**
   * Get the base path for images from content path
   * @private
   */
  _getImageBasePath(contentPath) {
    return this._getBasePath(contentPath)
  }

  /**
   * Resolve relative image path to GitHub raw URL
   * @private
   */
  _resolveImagePath(src, basePath, baseImageUrl) {
    if (!baseImageUrl) {
      console.warn('Base image URL not provided')
      return src
    }

    // Remove leading './'
    let cleanSrc = src.replace(/^\.\//, '')

    // Handle '../' paths by navigating up from the base path
    let finalPath = basePath
    const srcParts = cleanSrc.split('/')

    for (let i = 0; i < srcParts.length; i++) {
      if (srcParts[i] === '..') {
        // Go up one directory
        const pathParts = finalPath.split('/').filter(Boolean)
        pathParts.pop()
        finalPath = pathParts.join('/')
      } else {
        // Found a non-parent reference, reconstruct remaining path
        const remainingParts = srcParts.slice(i)
        cleanSrc = remainingParts.join('/')
        break
      }
    }

    // baseImageUrl already includes the base path, so just append the clean source
    return `${baseImageUrl}/${cleanSrc}`
  }
}

// Export singleton instance
export default new MarkdownService()
