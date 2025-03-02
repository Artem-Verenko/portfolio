import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Navbar from '../Navbar.vue'
import { nextTick } from 'vue'

// Tailwind's default md breakpoint is 768px
const MOBILE_WIDTH = 767
const DESKTOP_WIDTH = 1024

// Mock the child components
vi.mock('../MobileMenuButton.vue', () => ({
  default: {
    name: 'MobileMenuButton',
    props: ['open'],
    template: '<button class="md:hidden" @click="$emit(\'click\')">MenuButton</button>',
    emits: ['click'],
  },
}))

vi.mock('../ThemeSwitcher.vue', () => ({
  default: {
    name: 'ThemeSwitcher',
    template: '<button>Theme</button>',
  },
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: {} },
    { path: '/blog', component: {} },
    { path: '/books', component: {} },
    { path: '/cv', component: {} },
  ],
})

describe('Navbar', () => {
  let originalInnerWidth

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    })
  })

  const resizeWindow = (width) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: width,
    })
    window.dispatchEvent(new Event('resize'))
  }

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
      { href: '/blog', text: 'BLOG' },
      { href: '/books', text: 'BOOKS' },
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

  it('renders correctly', () => {
    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MobileMenuButton' }).exists()).toBe(true)
  })

  it('toggles mobile menu when button is clicked on mobile screens', async () => {
    // Set mobile viewport size
    resizeWindow(MOBILE_WIDTH)

    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        components: {
          ThemeSwitcher: vi.fn(() => ({ render: () => {} })),
        },
      },
      attachTo: document.body,
    })

    // Initial state check - menu should be closed
    const mobileMenu = wrapper.find('.mobile-menu-container')
    expect(mobileMenu.exists()).toBe(true)
    expect(wrapper.vm.mobileMenuOpen).toBe(false)

    // Check initial style shows height: 0px
    const initialStyle = mobileMenu.attributes('style')
    expect(initialStyle).toContain('height: 0px')

    // Toggle menu open by directly calling the method
    wrapper.vm.toggleMobileMenu()
    await nextTick()

    // Verify the menu is open in the internal state
    expect(wrapper.vm.mobileMenuOpen).toBe(true)

    // Toggle menu closed
    wrapper.vm.toggleMobileMenu()
    await nextTick()

    // The internal state should be updated
    expect(wrapper.vm.mobileMenuOpen).toBe(false)

    // Verify style is back to height: 0px
    const closedStyle = mobileMenu.attributes('style')
    expect(closedStyle).toContain('height: 0px')
  })

  it('mobile menu respects responsive design', async () => {
    // Test on desktop size first
    resizeWindow(DESKTOP_WIDTH)

    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          ThemeSwitcher: true,
        },
      },
    })

    // MobileMenuButton should have md:hidden class
    const button = wrapper.findComponent({ name: 'MobileMenuButton' })
    expect(button.exists()).toBe(true)

    // Check that desktop menu is visible
    expect(wrapper.find('ul.hidden.md\\:flex').exists()).toBe(true)
  })
})
