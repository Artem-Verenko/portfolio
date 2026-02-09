<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] bg-[url(@/assets/background.png)] bg-cover bg-fixed bg-center"
  >
    <Navbar />
    <main class="grow">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
