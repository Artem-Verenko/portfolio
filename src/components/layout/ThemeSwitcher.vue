<template>
  <button
    @click="toggleTheme"
    class="theme-switcher"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :data-theme="isDark ? 'dark' : 'light'"
  >
    <img
      v-if="isDark"
      src="@/assets/icons/sun_icon.png"
      alt="Light mode"
      class="icon w-10 h-10"
      :style="{ filter: 'invert(1)' }"
    />
    <img
      v-else
      src="@/assets/icons/moon_icon.png"
      alt="Dark mode"
      class="icon w-10 h-10"
      :style="{ filter: 'invert(0)' }"
    />
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const applyTheme = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme !== 'light'
  applyTheme(isDark.value)
})

watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  applyTheme(newValue)
})
</script>
