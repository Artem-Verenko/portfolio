<template>
  <section id="achievements" class="container mx-auto pb-12">
    <!-- Section heading for consistency -->
    <div class="text-center mb-4 mt-4">
      <h2 class="text-3xl font-bold">Achievements</h2>
      <div class="w-24 h-1 mx-auto bg-[var(--accent-color)] mt-3 mb-3"></div>
    </div>

    <!-- Mobile view (single card with navigation) -->
    <div class="md:hidden">
      <div
        class="rounded-lg p-6 shadow-lg mx-auto max-w-sm min-h-[180px] border-b-2 border-[var(--accent-color)] bg-[var(--nav-bg)] backdrop-blur-xl"
        :style="{
          border: '1px solid var(--border-color)',
        }"
      >
        <h3 class="text-xl font-bold mb-2">{{ achievements[mobileActiveIndex].title }}</h3>
        <p class="text-[var(--text-secondary)]">
          {{ achievements[mobileActiveIndex].description }}
        </p>
      </div>

      <!-- Mobile navigation dots -->
      <div class="flex justify-center mt-6 space-x-2">
        <button
          v-for="(_, index) in achievements"
          :key="`mobile-dot-${index}`"
          @click="mobileActiveIndex = index"
          class="w-3 h-3 rounded-full transition-all duration-300 focus:outline-none"
          :class="
            mobileActiveIndex === index ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'
          "
          :aria-label="`Go to achievement ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- Desktop carousel -->
    <div class="hidden md:flex flex-col items-center">
      <div class="relative w-full max-w-4xl h-[270px]">
        <div
          v-for="(achievement, index) in achievements"
          :key="index"
          @click="moveToCenter(index)"
          @keydown.enter="moveToCenter(index)"
          tabindex="0"
          class="achievement-card absolute inset-0 rounded-lg p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl border-b-2 border-[var(--accent-color)] backdrop-blur-xl"
          :class="{
            'cursor-pointer': getPosition(index) !== 'center',
          }"
          :style="{
            backgroundColor: 'var(--nav-bg)',
            border: '1px solid var(--border-color)',
            width: getCardWidth(index),
            zIndex: getZIndex(index),
            opacity: getOpacity(index),
            left: getLeftPosition(index),
            visibility: isCardVisible(index) ? 'visible' : 'hidden',
            transform: getCardTransform(index),
            boxShadow:
              getPosition(index) === 'center'
                ? 'var(--shadow-strength) var(--shadow-color)'
                : 'none',
          }"
        >
          <h3 class="text-xl font-bold mb-3">{{ achievement.title }}</h3>
          <p class="text-[var(--text-secondary)]">{{ achievement.description }}</p>
        </div>
      </div>

      <!-- Desktop navigation dots -->
      <div class="flex justify-center mt-6 space-x-3">
        <button
          v-for="(_, index) in achievements"
          :key="`desktop-dot-${index}`"
          @click="moveToCenter(index)"
          class="w-3 h-3 rounded-full transition-all duration-300 focus:outline-none"
          :class="
            centerIndex === index
              ? 'bg-[var(--accent-color)]'
              : 'bg-[var(--border-color)] hover:bg-[var(--accent-hover)]'
          "
          :aria-label="`Go to achievement ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const achievements = [
  {
    title: 'TensorFlow Developer Certificate',
    description:
      'Certified TensorFlow Developer with expertise in machine learning and deep learning frameworks. Credential verified at https://www.credential.net/8ca4a0b3-b199-406b-9e3d-1fc2cc787591',
  },
  {
    title: 'NICE AI Ambassador',
    description:
      'Conducting workshops and driving the rapid adoption of AI technologies across multinational teams, helping organizations leverage AI for business transformation.',
  },
  {
    title: 'ASE Community Member',
    description:
      'Agile Software Engineering community member - a group of individuals who are passionate about software development and agile methodologies.',
  },
  {
    title: 'Programming Mentor',
    description:
      'As a programming mentor, I have guided and supported aspiring developers, sharing my knowledge and experience to help them grow in their careers.',
  },
  {
    title: 'Customer Focus Team',
    description:
      'Contributed to the Customer Focus Team (CFT) for rapid issue resolution, ensuring high-quality customer experiences and efficient problem-solving processes.',
  },
  {
    title: 'Member of Code Evolution',
    description:
      'Being part of this community allows me to stay at the forefront of GenAI, deepen my expertise, and connect with like-minded developers passionate about AI.',
  },
]

// Desktop carousel controls
const centerIndex = ref(1)

// Mobile view controls
const mobileActiveIndex = ref(0)

// Keep both views in sync
watch(centerIndex, (newVal) => {
  mobileActiveIndex.value = newVal
})

watch(mobileActiveIndex, (newVal) => {
  centerIndex.value = newVal
})

// Fixed position mapping for better control
const getPosition = (index) => {
  const total = achievements.length

  if (index === centerIndex.value) return 'center'

  // Handle circular positioning for "left" card
  if (index === (centerIndex.value - 1 + total) % total) {
    return 'left'
  }

  // Handle circular positioning for "right" card
  if (index === (centerIndex.value + 1) % total) {
    return 'right'
  }

  // If not left, right, or center, it's offscreen
  return 'offscreen'
}

// Return consistent z-index values
const getZIndex = (index) => {
  const position = getPosition(index)
  if (position === 'center') return 30
  if (position === 'left' || position === 'right') return 20
  return 10
}

// Return opacity based on position
const getOpacity = (index) => {
  const position = getPosition(index)
  if (position === 'center') return 1
  if (position === 'left' || position === 'right') return 0.8
  return 0
}

// Determine if card should be visible
const isCardVisible = (index) => {
  const position = getPosition(index)
  return position !== 'offscreen'
}

// Get card width based on position
const getCardWidth = (index) => {
  const position = getPosition(index)
  if (position === 'center') return '450px'
  if (position === 'left' || position === 'right') return '380px'
  return '0'
}

// Calculate left position for absolute positioning
const getLeftPosition = (index) => {
  const position = getPosition(index)
  if (position === 'center') return '50%'
  if (position === 'left') return '15%'
  if (position === 'right') return '85%'
  return '50%'
}

// Get transform style for each card
const getCardTransform = (index) => {
  const position = getPosition(index)
  switch (position) {
    case 'center':
      return 'translate(-50%, 0) scale(1)'
    case 'left':
      return 'translate(-50%, 0) scale(0.85)'
    case 'right':
      return 'translate(-50%, 0) scale(0.85)'
    default:
      return 'translate(-50%, 50px) scale(0.7)'
  }
}

// Function to move a card to the center
const moveToCenter = (index) => {
  if (index !== centerIndex.value) {
    centerIndex.value = index
  }
}

// Auto-cycling functionality
let autoplayInterval = null

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    centerIndex.value = (centerIndex.value + 1) % achievements.length
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
}

// Setup autoplay on mount and cleanup on unmount
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

// Pause autoplay when user interacts with carousel
// const pauseAutoplay = () => {
//    stopAutoplay()
//   setTimeout(startAutoplay, 10000) // Resume after 10 seconds of inactivity
// }

// Add pause on interaction
// const moveWithPause = (index) => {
//   pauseAutoplay()
//   moveToCenter(index)
// }
</script>

<style scoped>
.achievement-card {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  max-height: 280px;
  overflow-y: auto;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-origin: center;
}

/* Custom scrollbar for achievement cards */
.achievement-card::-webkit-scrollbar {
  width: 4px;
}

.achievement-card::-webkit-scrollbar-track {
  background: transparent;
}

.achievement-card::-webkit-scrollbar-thumb {
  background-color: var(--accent-color);
  border-radius: 6px;
}

/* Glass effect enhancement */
@supports (backdrop-filter: blur(15px)) {
  .achievement-card {
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }
}

/* Improve touch experience */
@media (hover: none) {
  .achievement-card {
    touch-action: pan-y;
  }
}
</style>
