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

const assetModules = import.meta.glob('../../assets/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
})

const assetByName = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split('/').pop(), url]),
)

const getImageUrl = (path) => {
  if (!path) return ''

  if (path.match(/^https?:\/\//)) {
    return path
  }

  if (assetByName[path]) {
    return assetByName[path]
  }

  console.warn(`Missing asset mapping for: ${path}`)
  return ''
}

onMounted(() => {
  educations.value = dbCards.educations
})
</script>
