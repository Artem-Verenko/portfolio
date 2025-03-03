import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MobileMenuButton from '@/assets/MobileMenuButton.vue'

// Tailwind's default md breakpoint is 768px
const MOBILE_WIDTH = 767

describe('MobileMenuButton Emission Test', () => {
  let originalInnerWidth

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: MOBILE_WIDTH,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    })
  })

  it('properly emits click event with correct data', async () => {
    const wrapper = mount(MobileMenuButton)

    // Verify initial state
    expect(wrapper.emitted('click')).toBeUndefined()

    // Click button
    await wrapper.find('button').trigger('click')

    // Verify event was emitted
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click').length).toBe(1)

    // Click again
    await wrapper.find('button').trigger('click')

    // Verify event was emitted again
    expect(wrapper.emitted('click').length).toBe(2)
  })

  it('has the md:hidden class for responsive behavior', () => {
    const wrapper = mount(MobileMenuButton)
    expect(wrapper.find('button').classes()).toContain('md:hidden')
  })
})
