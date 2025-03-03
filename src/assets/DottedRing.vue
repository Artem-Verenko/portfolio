<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div class="relative w-full h-full ring-container">
      <svg class="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="var(--accent-color)"
          stroke-width="1"
          stroke-dasharray="5 15 25 5 25 5"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.ring-container {
  animation: spin 15s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
