import { createRouter, createWebHashHistory } from 'vue-router'
import Blog from '../views/Blog.vue'
import Books from '../views/Books.vue'
import Home from '@/views/Home.vue'
import ArticlePage from '@/views/ArticlePage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
    },
    {
      path: '/blog/articles/:id',
      name: 'ArticlePage',
      component: ArticlePage,
      props: true,
    },
    {
      path: '/books',
      name: 'Books',
      component: Books,
    },
  ],
})

export default router
