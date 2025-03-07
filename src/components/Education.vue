<template>
  <section id="education" class="container mx-auto px-4">
    <div class="space-y-8">
      <div
        v-for="(education, index) in educations"
        :key="index"
        class="education-card rounded-lg p-8 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
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
        <div v-for="(degree, degIndex) in education.degrees" :key="degIndex" class="degree-item">
          <p class="degree-title mb-1">{{ degree.title }}</p>
          <p class="degree-period text-sm">{{ degree.period }}</p>
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
  // Handle both direct imports and paths with @ alias
  if (path.startsWith('@/')) {
    return new URL(path.replace('@/', '../'), import.meta.url).href
  }
  return path
}

onMounted(() => {
  educations.value = dbCards.educations
})
</script>

<style scoped>
.education-card {
  background-color: var(--nav-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  transition: var(--transition-standard);
  box-shadow: var(--shadow-strength) var(--shadow-color);
  color: var(--text-color);
}

.education-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
}

.degree-title {
  font-weight: 600;
  color: var(--primary-color);
}

.degree-period {
  color: var(--text-secondary);
}

.degree-item:not(:last-child) {
  margin-bottom: 0.75rem;
}
</style>
