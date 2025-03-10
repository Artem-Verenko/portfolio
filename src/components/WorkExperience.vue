<template>
  <section id="experience" class="container mx-auto px-4">
    <div class="space-y-8">
      <div
        v-for="(experience, index) in workExperiences"
        :key="index"
        class="border border-[var(--border-color)] transition-all duration-300 shadow-[var(--shadow-strength)_var(--shadow-color)] text-[var(--text-color)] bg-[var(--nav-bg)] backdrop-blur-xl rounded-lg p-8 transform hover:translate-y-[-4px] hover:border-[var(--accent-color)] hover:shadow-xl"
      >
        <div class="flex items-center mb-2">
          <img
            :src="getImageUrl(experience.logo)"
            :alt="experience.company"
            class="inline-block mr-2 w-10 h-10"
          />
          <h3 class="text-2xl font-semibold inline-block">{{ experience.company }}</h3>
        </div>
        <div v-for="(position, posIndex) in experience.positions" :key="posIndex">
          <div class="flex items-start">
            <span class="text-[var(--accent-color)] leading-[1.5] mr-2">&#9675;</span>
            <div>
              <p class="font-semibold text-[var(--primary-color)]">{{ position.title }}</p>
              <p class="text-[var(--text-secondary)] text-sm mb-1">{{ position.period }}</p>
              <p
                v-for="(description, descIndex) in position.descriptions"
                :key="descIndex"
                class="text-[var(--text-color)] mb-4"
              >
                {{ description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dbCards from '@/assets/data/db_cards.json'

const workExperiences = ref([])

const getImageUrl = (path) => {
  // Handle both direct imports and paths with @ alias
  if (path.startsWith('@/')) {
    return new URL(path.replace('@/', '../'), import.meta.url).href
  }
  return path
}

onMounted(() => {
  workExperiences.value = dbCards.workExperiences
})
</script>
