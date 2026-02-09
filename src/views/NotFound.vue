<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 class="text-6xl font-bold text-[var(--accent-color)] mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-6">Page Not Found</h2>
    <p class="text-[var(--text-secondary)] mb-8">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <router-link
      to="/"
      class="px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
    >
      Go Home
    </router-link>
  </div>
</template>
