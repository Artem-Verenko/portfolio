<template>
  <div>
    <HeroSection />
    <Education />
    <WorkExperience />
  </div>
</template>

<script>
import Education from '@/components/Education.vue'
import HeroSection from '../components/HeroSection.vue'
import WorkExperience from '@/components/WorkExperience.vue'

export default {
  name: 'Home',
  components: {
    HeroSection,
    Education,
    WorkExperience,
  },
}
</script>
