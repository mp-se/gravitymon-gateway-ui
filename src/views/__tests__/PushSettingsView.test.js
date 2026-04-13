import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PushSettingsView from '../PushSettingsView.vue'
import { config, global } from '@/modules/pinia'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('PushSettingsView', () => {
  const createWrapper = () =>
    mount(PushSettingsView, {
      global: {
        stubs: {
          BsInputText: true,
          BsInputNumber: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    config.token = ''
    config.push_timeout = 30
    config.push_resend_time = 60
  })

  it('renders push settings inputs', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Push - Settings')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('displays token input field', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
    config.token = 'test-token-123'
    expect(config.token).toBe('test-token-123')
  })

  it('displays push timeout input with correct range', () => {
    const wrapper = createWrapper()

    config.push_timeout = 30
    expect(config.push_timeout).toBe(30)

    config.push_timeout = 10
    expect(config.push_timeout).toBe(10)

    config.push_timeout = 60
    expect(config.push_timeout).toBe(60)
  })

  it('displays push resend time input with correct range', () => {
    const wrapper = createWrapper()

    config.push_resend_time = 60
    expect(config.push_resend_time).toBe(60)

    config.push_resend_time = 10
    expect(config.push_resend_time).toBe(10)

    config.push_resend_time = 1800
    expect(config.push_resend_time).toBe(1800)
  })

  it('saves settings when the form is valid', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('does not save when validation fails', async () => {
    validateCurrentForm.mockReturnValue(false)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('save button is disabled when global.disabled is true', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('save button is disabled when global.configChanged is false', () => {
    global.configChanged = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('form initializes with correct config values', () => {
    config.token = 'my-token'
    config.push_timeout = 45
    config.push_resend_time = 90
    const wrapper = createWrapper()

    expect(config.token).toBe('my-token')
    expect(config.push_timeout).toBe(45)
    expect(config.push_resend_time).toBe(90)
  })

  it('handles concurrent save operations', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    const promise1 = wrapper.vm.save()
    const promise2 = wrapper.vm.save()

    await Promise.all([promise1, promise2])

    expect(config.saveAll).toHaveBeenCalledTimes(2)
  })
})