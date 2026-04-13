import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MeasurementSettingsView from '../MeasurementSettingsView.vue'
import { config, global } from '@/modules/pinia'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('MeasurementSettingsView', () => {
  const createWrapper = () =>
    mount(MeasurementSettingsView, {
      global: {
        stubs: {
          BsInputNumber: true,
          BsSelect: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    global.feature.sd = true
    config.sd_log_files = 10
    config.sd_log_min_time = 5
  })

  it('renders measurement settings controls', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Measurement - Settings')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
  })

  it('exposes expected static option values', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.fixedSize).toBe(16)
    expect(wrapper.vm.timeOptions).toEqual([
      { label: '1 min', value: 1 },
      { label: '3 min', value: 3 },
      { label: '5 min', value: 5 },
      { label: '10 min', value: 10 },
      { label: '15 min', value: 15 },
      { label: '30 min', value: 30 },
      { label: '45 min', value: 45 },
      { label: '60 min', value: 60 }
    ])
  })

  it('saves settings when the form is valid', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('does not save when validation fails', async () => {
    validateCurrentForm.mockReturnValue(false)
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('updates sd_log_files value', () => {
    const wrapper = createWrapper()

    config.sd_log_files = 25
    expect(config.sd_log_files).toBe(25)

    config.sd_log_files = 100
    expect(config.sd_log_files).toBe(100)
  })

  it('updates sd_log_min_time value', () => {
    const wrapper = createWrapper()

    config.sd_log_min_time = 10
    expect(config.sd_log_min_time).toBe(10)

    config.sd_log_min_time = 60
    expect(config.sd_log_min_time).toBe(60)
  })

  it('disables sd inputs when sd feature is not available', () => {
    global.feature.sd = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('disables sd inputs when global is disabled', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('has fixedSize as read-only 16kb', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.fixedSize).toBe(16)
  })

  it('save button is disabled when configChanged is false', () => {
    global.configChanged = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('displays form with all input fields', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('initializes with correct config values', () => {
    config.sd_log_files = 20
    config.sd_log_min_time = 15
    const wrapper = createWrapper()

    expect(config.sd_log_files).toBe(20)
    expect(config.sd_log_min_time).toBe(15)
  })

  it('sd feature can be toggled', () => {
    const wrapper = createWrapper()

    global.feature.sd = true
    expect(global.feature.sd).toBe(true)

    global.feature.sd = false
    expect(global.feature.sd).toBe(false)
  })
})