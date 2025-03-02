<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] bg-[url(@/assets/background.png)] bg-cover bg-fixed bg-center"
  >
    <Navbar />
    <RouterView />
  </div>
</template>
