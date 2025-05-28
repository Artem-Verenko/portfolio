<template>
  <nav
    role="navigation"
    class="navbar fixed top-0 left-0 w-full border-b-2 border-(--accent-color) bg-(--nav-bg) backdrop-blur-xl z-50 transition-all duration-300"
  >
    <div class="container mx-auto px-5 py-4 flex items-center justify-between">
      <div class="font-bold leading-none">
        <router-link to="/" class="transition-colors duration-300">
          <span class="text-(--primary-color) text-2xl font-mono">Artem Verenko</span
          ><span class="text-(--accent-color) text-2xl font-mono">.</span>
        </router-link>
      </div>
      <div class="flex items-center space-x-8">
        <!-- Desktop Menu -->
        <ul class="hidden md:flex space-x-8">
          <li class="font-mono font-semibold text-[0.95rem] tracking-[0.05em]">
            <router-link to="/blog" class="hover:text-[var(--accent-hover)]">BLOG</router-link>
          </li>
          <li class="font-mono font-semibold text-[0.95rem] tracking-[0.05em]">
            <router-link to="/books" class="hover:text-[var(--accent-hover)]">BOOKS</router-link>
          </li>
        </ul>
        <!-- Mobile Menu Button -->
        <div class="flex items-center space-x-5">
          <MobileMenuButton :open="mobileMenuOpen" @click="toggleMobileMenu" />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div
      class="mobile-menu-container md:hidden overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.33,_1,_0.68,_1)] will-change-[height]"
      :style="{ height: mobileMenuOpen ? mobileMenuHeight + 'px' : '0px' }"
    >
      <div
        ref="mobileMenuContent"
        class="shadow-lg border-t border-(--accent-color) text-center"
        data-testid="mobile-menu"
      >
        <ul class="px-6 py-4 space-y-3">
          <li class="font-mono font-semibold text-[0.95rem] tracking-[0.05em]">
            <router-link
              @click="toggleMobileMenu"
              to="/blog"
              class="block py-2 transition-all duration-300 hover:text-[var(--accent-color)] hover:scale-105"
              >BLOG</router-link
            >
          </li>
          <li class="font-mono font-semibold text-[0.95rem] tracking-[0.05em]">
            <router-link
              @click="toggleMobileMenu"
              to="/books"
              class="block py-2 transition-all duration-300 hover:text-[var(--accent-color)] hover:scale-105"
              >BOOKS</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import MobileMenuButton from '@/assets/MobileMenuButton.vue'

const mobileMenuOpen = ref(false)
const mobileMenuContent = ref(null)
const mobileMenuHeight = ref(0)

const updateMenuHeight = async () => {
  if (mobileMenuOpen.value) {
    await nextTick()
    mobileMenuHeight.value = mobileMenuContent.value?.scrollHeight || 0
  } else {
    mobileMenuHeight.value = 0
  }
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

watch(mobileMenuOpen, updateMenuHeight)

onMounted(() => {
  updateMenuHeight()
  window.addEventListener('resize', updateMenuHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMenuHeight)
})
</script>
