<template>
  <div>
    <slot v-if="!hasError"></slot>

    <!-- Error State -->
    <div v-else class="error-boundary">
      <div class="error-container max-w-2xl mx-auto px-5 py-16 text-center">
        <!-- Error Icon -->
        <div class="mb-6">
          <svg
            class="w-16 h-16 mx-auto text-[var(--accent-color)] opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <!-- Error Title -->
        <h2 class="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-4">
          {{ errorTitle }}
        </h2>

        <!-- Error Message -->
        <p class="text-[var(--text-secondary)] mb-8 text-lg">
          {{ errorMessage }}
        </p>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 flex-wrap">
          <button
            v-if="showRetry"
            @click="retry"
            :disabled="isRetrying"
            class="px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isRetrying ? 'Retrying...' : 'Try Again' }}
          </button>

          <button
            v-if="showGoBack"
            @click="goBack"
            class="px-6 py-3 border-2 border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white font-semibold rounded-lg transition-colors"
          >
            Go Back
          </button>

          <router-link
            v-if="showGoHome"
            to="/"
            class="px-6 py-3 border-2 border-[var(--border-color)] text-[var(--text-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] font-semibold rounded-lg transition-colors inline-block"
          >
            Go Home
          </router-link>
        </div>

        <!-- Technical Details (Development Only) -->
        <details v-if="showTechnicalDetails && isDevelopment" class="mt-8 text-left">
          <summary
            class="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--accent-color)] mb-2"
          >
            Technical Details
          </summary>
          <pre
            class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded p-4 text-sm overflow-auto text-[var(--text-secondary)]"
            >{{ errorDetails }}</pre
          >
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // Custom error title
  title: {
    type: String,
    default: '',
  },
  // Custom error message
  message: {
    type: String,
    default: '',
  },
  // Show retry button
  showRetry: {
    type: Boolean,
    default: true,
  },
  // Show go back button
  showGoBack: {
    type: Boolean,
    default: true,
  },
  // Show go home button
  showGoHome: {
    type: Boolean,
    default: true,
  },
  // Show technical details
  showTechnicalDetails: {
    type: Boolean,
    default: true,
  },
  // Custom retry handler
  onRetry: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['error', 'retry'])

const router = useRouter()
const error = ref(null)
const hasError = computed(() => error.value !== null)
const isRetrying = ref(false)
const isDevelopment = import.meta.env.DEV

// Map error types to user-friendly messages
const ERROR_MESSAGES = {
  NetworkError: 'Unable to connect to the server. Please check your internet connection.',
  NotFound: 'The requested content could not be found.',
  Unauthorized: 'You do not have permission to access this content.',
  ServerError: 'A server error occurred. Please try again later.',
  ValidationError: 'The provided data is invalid. Please check and try again.',
  Timeout: 'The request took too long. Please try again.',
  Default: 'Something went wrong. Please try again later.',
}

const getErrorType = (err) => {
  if (!err) return 'Default'

  const message = err.message || String(err)

  if (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('NetworkError')
  ) {
    return 'NetworkError'
  }
  if (message.includes('404') || message.includes('not found')) {
    return 'NotFound'
  }
  if (message.includes('401') || message.includes('403') || message.includes('Unauthorized')) {
    return 'Unauthorized'
  }
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return 'ServerError'
  }
  if (message.includes('timeout')) {
    return 'Timeout'
  }
  if (message.includes('validation')) {
    return 'ValidationError'
  }

  return 'Default'
}

const errorTitle = computed(() => {
  if (props.title) return props.title

  const type = getErrorType(error.value)

  const titles = {
    NetworkError: 'Connection Problem',
    NotFound: 'Content Not Found',
    Unauthorized: 'Access Denied',
    ServerError: 'Server Error',
    ValidationError: 'Invalid Data',
    Timeout: 'Request Timeout',
    Default: 'Oops! Something Went Wrong',
  }

  return titles[type] || titles.Default
})

const errorMessage = computed(() => {
  if (props.message) return props.message

  const type = getErrorType(error.value)
  return ERROR_MESSAGES[type] || ERROR_MESSAGES.Default
})

const errorDetails = computed(() => {
  if (!error.value) return ''

  return JSON.stringify(
    {
      message: error.value.message,
      stack: error.value.stack,
      type: error.value.constructor.name,
    },
    null,
    2,
  )
})

const retry = async () => {
  isRetrying.value = true
  emit('retry')

  try {
    if (props.onRetry) {
      await props.onRetry()
    }
    // Clear error and retry
    error.value = null
  } catch (e) {
    // If retry fails, keep the error state
    console.error('Retry failed:', e)
  } finally {
    isRetrying.value = false
  }
}

const goBack = () => {
  router.back()
}

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  error.value = err
  emit('error', { error: err, instance, info })

  // Log in development
  if (isDevelopment) {
    console.error('Error caught by ErrorBoundary:', err, info)
  }

  // Prevent error from propagating
  return false
})
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
