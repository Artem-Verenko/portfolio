<template>
  <div>
    <HeroSection />
    <CvController />
    <Achievements />
  </div>
</template>

<script>
import Education from '@/components/Education.vue'
import HeroSection from '../components/HeroSection.vue'
import WorkExperience from '@/components/WorkExperience.vue'
import CvController from '@/components/CvController.vue'
import Achievements from '@/components/Achievements.vue'

export default {
  name: 'Home',
  components: {
    HeroSection,
    Education,
    WorkExperience,
    CvController,
    Achievements,
  },
}
</script>
