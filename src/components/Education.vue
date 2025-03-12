<template>
  <section id="education" class="container mx-auto px-4">
    <div class="space-y-8">
      <div
        v-for="(education, index) in educations"
        :key="index"
        class="bg-[var(--nav-bg)] backdrop-filter backdrop-blur-[10px] border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] rounded-lg p-8 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-xl"
      >
        <div class="flex items-center mb-2">
          <img
            :src="getImageUrl(education.logo)"
            :alt="education.institution"
            class="inline-block mr-2 w-10 h-10"
          />
          <h3 class="text-2xl font-semibold inline-block">
            {{ education.institution }}
          </h3>
        </div>
        <div v-for="(degree, degIndex) in education.degrees" :key="degIndex" class="mb-3 last:mb-0">
          <p class="mb-1 font-semibold text-[var(--primary-color)]">
            {{ degree.title }}
          </p>
          <p class="text-sm text-[var(--text-secondary)]">{{ degree.period }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dbCards from '@/assets/data/db_cards.json'

const educations = ref([])

const getImageUrl = (path) => {
  try {
    if (path.startsWith('@/')) {
      // Handle paths with @ alias
      return new URL(path.replace('@/', '../'), import.meta.url).href
    } else if (path.startsWith('./') || path.startsWith('../')) {
      // Handle relative paths
      return new URL(path, import.meta.url).href
    } else if (path.match(/^https?:\/\//)) {
      // External URLs
      return path
    } else {
      // Assume path is relative to assets
      return new URL(`../assets/${path}`, import.meta.url).href
    }
  } catch (error) {
    console.error(`Failed to load image: ${path}`, error)
    return new URL('../assets/placeholder.png', import.meta.url).href
  }
}

onMounted(() => {
  educations.value = dbCards.educations
})
</script>
