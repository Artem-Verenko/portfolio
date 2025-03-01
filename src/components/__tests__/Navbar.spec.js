import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Navbar from '../Navbar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/blog', component: {} },
    { path: '/books', component: {} },
    { path: '/cv', component: {} },
  ],
})

describe('Navbar', () => {
  it('provides accessible navigation', () => {
    const wrapper = mount(Navbar, {
      global: { plugins: [router] },
    })

    const nav = wrapper.get('nav')
    expect(nav.attributes('role')).toBe('navigation')
    expect(nav.find('ul')).toBeTruthy()
  })

  it('renders all navigation items correctly', () => {
    const wrapper = mount(Navbar, {
      global: { plugins: [router] },
    })

    const expectedLinks = [
      { href: '/blog', text: 'Blog' },
      { href: '/books', text: 'Books' },
    ]

    expectedLinks.forEach(({ href, text }) => {
      const link = wrapper.get(`a[href="${href}"]`)
      expect(link.text()).toBe(text)
    })
  })

  it('applies correct styles to active link', async () => {
    const wrapper = mount(Navbar, {
      global: { plugins: [router] },
    })

    await router.push('/books')
    await router.isReady()

    const activeLink = wrapper.get('a[href="/books"]')
    expect(activeLink.classes()).toContain('router-link-active')

    // Verify other links are not active
    const inactiveLinks = wrapper
      .findAll('a')
      .filter((link) => link.attributes('href') !== '/books')
    inactiveLinks.forEach((link) => {
      expect(link.classes()).not.toContain('router-link-active')
    })
  })

  it('handles navigation correctly', async () => {
    const wrapper = mount(Navbar, {
      global: { plugins: [router] },
    })

    await router.push('/blog')
    expect(router.currentRoute.value.path).toBe('/blog')

    await router.push('/books')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/books')
  })
})
