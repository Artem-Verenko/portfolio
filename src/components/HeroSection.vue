<template>
  <section class="container mx-auto px-5 pt-18">
    <div class="flex flex-col md:flex-row items-center">
      <div class="text-center md:text-left">
        <p class="text-xl md:text-2xl mb-2 mt-3">Software Developer</p>

        <!-- На medium та великих екранах показуємо "Hello, I'm" -->
        <h2
          class="hidden md:block bg-clip-text text-white text-5xl md:text-6xl font-bold mb-6 animate-fadeIn"
        >
          Hello, I'm
        </h2>
        <!-- На маленьких екранах показуємо DottedRing із зображенням -->
        <div class="block md:hidden mb-2">
          <div class="relative w-32 h-32 flex-shrink-0 overflow-hidden mx-auto">
            <div class="w-full h-full relative">
              <DottedRing />
              <img
                src="@/assets/prof.png"
                alt="Professional Photo"
                class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] object-cover rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>

        <h2
          class="bg-clip-text text-accent text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-fadeIn text-(--accent-color)"
        >
          Artem Verenko
        </h2>
        <p class="text-xl md:text-2xl">
          With boundless enthusiasm, I delve into the world of Computer Science, forever inspired by
          the potential of programming to shape the world around us.
        </p>

        <div class="flex justify-center md:justify-start mt-6 space-x-4">
          <!-- Download CV Button -->
          <a
            href="#"
            class="flex items-center justify-center px-6 py-2 border border-[var(--accent-color)] rounded-full shadow-sm"
            download
          >
            <svg
              class="w-5 h-5 mr-2 fill-current text-[var(--accent-color)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm9 4v-2H3v2h18z" />
            </svg>
            <span class="text-[var(--accent-color)] whitespace-nowrap">DOWNLOAD CV</span>
          </a>

          <!-- GitHub Bubble Button -->
          <a
            href="https://github.com/Artem-Verenko"
            class="flex items-center justify-center w-12 h-12 border border-[var(--accent-color)] rounded-full shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              class="w-6 h-6 fill-current text-[var(--accent-color)]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
            <span class="sr-only">GitHub</span>
          </a>

          <!-- LinkedIn Bubble Button -->
          <a
            href="https://www.linkedin.com/in/artemverenko/"
            class="flex items-center justify-center w-12 h-12 border border-[var(--accent-color)] rounded-full shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              class="w-6 h-6 fill-current text-[var(--accent-color)]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.036-1.852-3.036-1.853 0-2.137 1.445-2.137 2.938v5.667H9.352V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.368-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM6.906 20.452H3.768V9h3.138v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.543C0 23.226.792 24 1.771 24h20.451C23.207 24 24 23.226 24 22.271V1.728C24 .774 23.207 0 22.225 0z"
              />
            </svg>
            <span class="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>

      <!-- Для medium та великих екранів: окремий контейнер для зображення з DottedRing -->
      <div
        class="hidden md:block relative w-96 h-96 md:ml-16 md:mt-16 md:mb-8 flex-shrink-0 overflow-hidden"
      >
        <div class="w-full h-full relative">
          <DottedRing />
          <img
            src="@/assets/prof.png"
            alt="Professional Photo"
            class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
  <Achievements />
</template>

<script setup>
import DottedRing from '@/assets/DottedRing.vue'
import Achievements from '@/components/Achievements.vue'
</script>
