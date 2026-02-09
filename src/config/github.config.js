/**
 * GitHub Configuration
 * Centralized configuration for public GitHub repository content
 */

/**
 * Validate required environment variables
 * @throws {Error} If required env vars are missing
 */
function validateConfig() {
  const required = ['VITE_GITHUB_OWNER', 'VITE_GITHUB_REPO', 'VITE_GITHUB_BRANCH']

  const missing = required.filter((key) => !import.meta.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please create a .env.local file with the required variables. ' +
        'See .env.example for reference.',
    )
  }
}

// Validate on import
try {
  validateConfig()
} catch (error) {
  console.error('GitHub configuration error:', error.message)
  throw error
}

/**
 * GitHub configuration object
 */
export const githubConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || '',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',

  // Content paths within the repository
  paths: {
    articles: 'articles',
    articlesManifest: 'articles/articles.json',
    books: 'books',
    booksDatabase: 'books/db_books.json',
    bookReviews: 'books/reviews',
    cv: 'cv',
  },

  // File naming templates
  templates: {
    article: (id) => `article-${id}.md`,
    bookReview: (id) => `book-${id}.md`,
    articleImage: (filename) => `articles/images/${filename}`,
    bookCover: (filename) => `books/covers/${filename}`,
  },

  // Cache TTL in milliseconds
  cacheTTL: {
    articles: 60 * 60 * 1000, // 1 hour
    books: 60 * 60 * 1000, // 1 hour
    cv: 24 * 60 * 60 * 1000, // 24 hours
  },

  // GitHub raw content URL builder
  getRawUrl(path) {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`
  },

  // Check if configuration is valid
  isConfigured() {
    return Boolean(this.owner && this.repo && this.branch)
  },
}

// Log configuration on load
console.log('[GitHub Config] Loaded:', {
  owner: githubConfig.owner,
  repo: githubConfig.repo,
  branch: githubConfig.branch,
})

export default githubConfig
