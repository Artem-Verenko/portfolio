import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ThemeSwitcher from '../ThemeSwitcher.vue'

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    // Reset document classes
    document.documentElement.className = ''

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders correctly', async () => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    const wrapper = mount(ThemeSwitcher)
    await flushPromises()

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('defaults to dark theme with no localStorage value', async () => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    const wrapper = mount(ThemeSwitcher)
    await flushPromises()

    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/sun_icon.png')
    expect(wrapper.find('img').attributes('alt')).toBe('Light mode')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles theme on click', async () => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    const wrapper = mount(ThemeSwitcher)
    await flushPromises()

    // Initial state (dark theme by default)
    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/sun_icon.png')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click to switch to light
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/moon_icon.png')
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light')
    expect(document.documentElement.classList.contains('light')).toBe(true)

    // Click to switch back to dark
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/sun_icon.png')
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('loads light theme from localStorage if specified', async () => {
    // Directly mock the getItem method to return 'light'
    Storage.prototype.getItem = vi.fn((key) => (key === 'theme' ? 'light' : null))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    const wrapper = mount(ThemeSwitcher)
    await flushPromises()

    expect(wrapper.attributes('data-theme')).toBe('light')
    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/moon_icon.png')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('loads dark theme from localStorage if specified', async () => {
    // Directly mock the getItem method
    Storage.prototype.getItem = vi.fn((key) => (key === 'theme' ? 'dark' : null))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    const wrapper = mount(ThemeSwitcher)
    await flushPromises()

    expect(wrapper.attributes('data-theme')).toBe('dark')
    expect(wrapper.find('img').attributes('src')).toBe('/portfolio/src/assets/icons/sun_icon.png')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
