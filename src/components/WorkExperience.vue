<template>
  <section id="experience" class="container mx-auto px-4">
    <div class="space-y-8">
      <div
        v-for="(experience, index) in workExperiences"
        :key="index"
        class="experience-card rounded-lg pt-8 pr-8 pl-8 pb-4 shadow-lg transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
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
            <span class="position-bullet mr-2">&#9675;</span>
            <div>
              <p class="position-title">{{ position.title }}</p>
              <p class="position-period text-sm mb-1">{{ position.period }}</p>
              <p
                v-for="(description, descIndex) in position.descriptions"
                :key="descIndex"
                class="position-description mb-4"
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

<style scoped>
.experience-card {
  background-color: var(--nav-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  transition: var(--transition-standard);
  box-shadow: var(--shadow-strength) var(--shadow-color);
  color: var(--text-color);
}

.experience-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
}

.position-title {
  font-weight: 600;
  color: var(--primary-color);
}

.position-period {
  color: var(--text-secondary);
}

.position-description {
  color: var(--text-color);
}

.position-bullet {
  color: var(--accent-color);
  line-height: 1.5;
}
</style>
