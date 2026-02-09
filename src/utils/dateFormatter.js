/**
 * Date formatting utilities
 */

/**
 * Format date to a readable string
 * @param {string|Date} date - Date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString(undefined, options)
  } catch {
    console.warn('Invalid date format:', date)
    return ''
  }
}

/**
 * Format date to ISO string
 * @param {string|Date} date - Date to format
 * @returns {string} - ISO date string
 */
export function toISODate(date) {
  if (!date) return ''
  try {
    return new Date(date).toISOString()
  } catch {
    console.warn('Invalid date format:', date)
    return ''
  }
}

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  try {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now - past) / 1000)

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit)
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
      }
    }

    return 'just now'
  } catch {
    console.warn('Invalid date format:', date)
    return ''
  }
}
