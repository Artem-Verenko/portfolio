<template>
  <button
    @click="$emit('click')"
    class="md:hidden focus:outline-none"
    type="button"
    :aria-label="open ? 'Close menu' : 'Open menu'"
    :aria-expanded="open"
    aria-controls="mobile-menu"
  >
    <svg
      v-if="!open"
      class="w-6 h-6"
      :style="{ stroke: 'var(--text-color)' }"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
    <svg
      v-else
      class="w-6 h-6"
      :style="{ stroke: 'var(--text-color)' }"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
