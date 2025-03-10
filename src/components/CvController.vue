<template>
  <section id="biography" class="container mx-auto pb-5">
    <!-- Section heading for consistency -->
    <div class="text-center mt-4">
      <h2 class="text-3xl font-bold">Biography</h2>
      <div class="w-24 h-1 mx-auto bg-[var(--accent-color)] mt-3 mb-3"></div>
    </div>
    <div class="container mx-auto p-4">
      <!-- Scrolling Card Container -->
      <div class="rounded-lg overflow-auto">
        <div class="flex flex-col md:flex-row">
          <!-- Vertical Menu -->
          <nav class="p-4 m-4 border-r-0 md:border-r-2 md:border-[var(--accent-color)]">
            <div class="flex flex-col space-y-4">
              <button @click="activeTab = 'experience'" :class="menuClasses('experience')">
                Experience
              </button>
              <button @click="activeTab = 'education'" :class="menuClasses('education')">
                Education
              </button>
              <button @click="activeTab = 'skills'" :class="menuClasses('skills')">Skills</button>
              <button @click="activeTab = 'about'" :class="menuClasses('about')">About me</button>
            </div>
          </nav>
          <!-- Content Area -->
          <div class="p-4 flex-1">
            <component :is="currentComponent" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import WorkExperience from './WorkExperience.vue'
import Education from './Education.vue'

const activeTab = ref('experience')

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'experience':
      return WorkExperience
    case 'education':
      return Education
    case 'skills':
      return {
        template: `<div class="p-4">
                    <h2 class="text-2xl font-bold">Skills</h2>
                    <p>Coming soon...</p>
                  </div>`,
      }
    case 'about':
      return {
        template: `<div class="p-4">
                    <h2 class="text-2xl font-bold">About me</h2>
                    <p>Coming soon...</p>
                  </div>`,
      }
    default:
      return WorkExperience
  }
})

const menuClasses = (tab) => {
  return activeTab.value === tab
    ? 'w-full py-3 px-4 bg-[var(--accent-color)] text-white font-semibold'
    : 'w-full py-3 px-4 bg-transparent text-[var(--text-color)] font-semibold hover:bg-[var(--accent-hover)] hover:text-white'
}
</script>
