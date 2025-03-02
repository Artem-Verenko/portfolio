<template>
  <nav
    role="navigation"
    class="navbar fixed top-0 left-0 w-full border-b-2 border-(--accent-color) bg-(--nav-bg) backdrop-blur-xl z-50 transition-all duration-300"
  >
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="font-bold leading-none">
        <router-link to="/" class="transition-colors duration-300 hover:opacity-80">
          <span class="text-(--primary-color) text-2xl font-mono">Artem Verenko</span
          ><span class="text-(--accent-color) text-2xl font-mono">.</span>
        </router-link>
      </div>
      <div class="flex items-center space-x-8">
        <!-- Desktop Menu -->
        <ul class="hidden md:flex space-x-8">
          <li class="nav-item">
            <router-link to="/blog" class="nav-link">BLOG</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/books" class="nav-link">BOOKS</router-link>
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
      class="mobile-menu-container md:hidden overflow-hidden"
      :style="{ height: mobileMenuOpen ? mobileMenuHeight + 'px' : '0px' }"
    >
      <div
        ref="mobileMenuContent"
        class="shadow-lg border-t border-(--accent-color) text-center"
        data-testid="mobile-menu"
      >
        <ul class="px-6 py-4 space-y-3">
          <li class="nav-item">
            <router-link @click="toggleMobileMenu" to="/blog" class="block py-2 nav-link-mobile"
              >BLOG</router-link
            >
          </li>
          <li class="nav-item">
            <router-link @click="toggleMobileMenu" to="/books" class="block py-2 nav-link-mobile"
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
import MobileMenuButton from './MobileMenuButton.vue'

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

<style scoped>
nav {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.05em;
}

.nav-link {
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--accent-color);
}

.nav-link-mobile {
  transition: all 0.3s ease;
}

.nav-link-mobile:hover {
  color: var(--accent-color);
  transform: scale(1.05);
}

.nav-link.router-link-active {
  color: var(--accent-color);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-color);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.nav-link-mobile.router-link-active {
  color: var(--accent-color);
  font-weight: 700;
}

/* Mobile Menu Animation */
.mobile-menu-container {
  transition: height 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: height;
}

/* Remove all old animation classes that are no longer used */
.menu-enter-active,
.menu-leave-active,
.menu-enter-from,
.menu-leave-to,
.menu-enter-to,
.menu-leave-from,
.fade-enter-active,
.fade-leave-active,
.fade-enter-from,
.fade-leave-to {
  display: none;
}
</style>
