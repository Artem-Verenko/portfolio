<template>
  <section>
    <div class="container mx-auto px-5">
      <div class="flex flex-wrap gap-4 justify-center md:justify-start">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="flex items-center bg-[var(--nav-bg)] backdrop-filter backdrop-blur-[10px] border border-[var(--border-color)] rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md hover:border-[var(--accent-color)]"
        >
          <div class="w-2 h-2 rounded-full bg-[var(--accent-color)] mr-2"></div>
          <span class="text-sm md:text-base">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
  'AWS',
  'GCP',
  '.NET',
  'Entity Framework',
  'JavaScript',
  'Amazon Bedrock',
  'Hugging Face',
  'RAG',
  'TensorFlow',
  'OpenAI',
  'LangChain',
  'Python',
  'Vue.js',
  'Node.js',
  'Tailwind CSS',
  'PostgreSQL',
  'Git',
  'Docker',
  'CI/CD',
  'Playwright',
  'TDD',
  'Agile Methodology',
])
</script>
