import { createRouter, createWebHashHistory } from 'vue-router'
import HeroSection from '../views/HeroSection.vue'
import Blog from '../views/Blog.vue'
import Books from '../views/Books.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
