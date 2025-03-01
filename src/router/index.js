import { createRouter, createWebHistory } from 'vue-router'
import HeroSection from '../views/HeroSection.vue'
import Blog from '../views/Blog.vue'
import Books from '../views/Books.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HeroSection',
      component: HeroSection,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
    },
    {
      path: '/books',
      name: 'Books',
      component: Books,
    },
  ],
})

export default router
