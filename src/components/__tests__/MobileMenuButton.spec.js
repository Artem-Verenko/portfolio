import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MobileMenuButton from '@/assets/MobileMenuButton.vue'

// Tailwind's default md breakpoint is 768px
const MOBILE_WIDTH = 767
const DESKTOP_WIDTH = 1024

describe('MobileMenuButton', () => {
  let originalInnerWidth

  beforeEach(() => {
    // Store the original innerWidth
    originalInnerWidth = window.innerWidth

    // Mock window.matchMedia to simulate responsive behavior
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    })
  })

  afterEach(() => {
    // Restore original innerWidth
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

  it('renders hamburger icon when closed', () => {
    resizeWindow(MOBILE_WIDTH)

    const wrapper = mount(MobileMenuButton, {
      props: {
        open: false,
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.find('path').attributes('d')).toContain('M4 6h16M4 12h16M4 18h16')
  })

  it('renders close icon when open', () => {
    resizeWindow(MOBILE_WIDTH)

    const wrapper = mount(MobileMenuButton, {
      props: {
        open: true,
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.find('path').attributes('d')).toContain('M6 18L18 6M6 6l12 12')
  })

  it('emits click event when clicked', async () => {
    resizeWindow(MOBILE_WIDTH)

    const wrapper = mount(MobileMenuButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('has md:hidden class for responsive behavior', () => {
    const wrapper = mount(MobileMenuButton)
    const button = wrapper.find('button')
    expect(button.classes()).toContain('md:hidden')
  })

  it('should be hidden on desktop screens', () => {
    // We're testing that the Tailwind class is applied correctly
    // The actual hiding happens in the browser via CSS, so we verify the class exists
    resizeWindow(DESKTOP_WIDTH)

    const wrapper = mount(MobileMenuButton)
    const button = wrapper.find('button')
    expect(button.classes()).toContain('md:hidden')
  })
})
