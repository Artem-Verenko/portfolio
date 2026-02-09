import { computed, ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import ImageService from '@/services/content/ImageService.js'

/**
 * Composable for loading an image with proper loading and error states
 * @param {Ref<string>|string} imagePath - Image path (can be a ref or value)
 * @returns {object} - { src, isLoading, error, retry }
 */
export function useImageLoader(imagePath) {
  const resolvedPath = computed(() => unref(imagePath))

  const query = useQuery({
    queryKey: computed(() => ['image', resolvedPath.value]),
    queryFn: async () => {
      const path = resolvedPath.value
      if (!path) return null

      // Get the image URL
      const src = ImageService.getImageSrc(path)

      // Preload the image to ensure it exists
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject(new Error(`Failed to load image: ${path}`))
        img.src = src
      })
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: computed(() => Boolean(resolvedPath.value)),
  })

  return {
    src: computed(() => query.data.value),
    isLoading: query.isLoading,
    error: query.error,
    retry: query.refetch,
  }
}

/**
 * Composable for loading multiple images
 * @param {Ref<Array<string>>|Array<string>} imagePaths - Array of image paths
 * @returns {object} - { images: Map<path, src>, isLoading, errors, allLoaded }
 */
export function useMultipleImageLoader(imagePaths) {
  const resolvedPaths = computed(() => unref(imagePaths) || [])
  const images = ref(new Map())
  const errors = ref(new Map())
  const loadingCount = ref(0)

  const allLoaded = computed(
    () => loadingCount.value === 0 && images.value.size === resolvedPaths.value.length,
  )

  const isLoading = computed(() => loadingCount.value > 0)

  // Load images individually using useImageLoader for each
  const loadImage = async (path) => {
    if (!path || images.value.has(path)) return

    loadingCount.value++

    try {
      const src = ImageService.getImageSrc(path)

      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject(new Error(`Failed to load image: ${path}`))
        img.src = src
      })

      images.value.set(path, src)
      errors.value.delete(path)
    } catch (error) {
      errors.value.set(path, error)
    } finally {
      loadingCount.value--
    }
  }

  // Watch for changes in paths and load images
  const loadAllImages = () => {
    resolvedPaths.value.forEach((path) => {
      if (path && !images.value.has(path) && !errors.value.has(path)) {
        loadImage(path)
      }
    })
  }

  return {
    images: computed(() => images.value),
    errors: computed(() => errors.value),
    isLoading,
    allLoaded,
    loadAllImages,
    getSrc: (path) => images.value.get(path),
    hasError: (path) => errors.value.has(path),
  }
}
