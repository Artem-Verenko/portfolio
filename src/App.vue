<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import backgroundUrl from '@/assets/background.png'
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] bg-cover bg-fixed bg-center"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <Navbar />
    <main class="grow">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
