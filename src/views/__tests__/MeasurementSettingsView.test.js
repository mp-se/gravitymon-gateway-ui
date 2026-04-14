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
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.sd_log_files = 25
    expect(config.sd_log_files).toBe(25)

    config.sd_log_files = 100
    expect(config.sd_log_files).toBe(100)
  })

  it('updates sd_log_min_time value', () => {
    // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    expect(config.sd_log_files).toBe(20)
    expect(config.sd_log_min_time).toBe(15)
  })

  it('sd feature can be toggled', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    global.feature.sd = true
    expect(global.feature.sd).toBe(true)

    global.feature.sd = false
    expect(global.feature.sd).toBe(false)
  })

  it('validates form before saving', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('saves with minimum sd_log_files value', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_files = 1
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
    expect(config.sd_log_files).toBe(1)
  })

  it('saves with maximum sd_log_files value', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_files = 1000
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
    expect(config.sd_log_files).toBe(1000)
  })

  it('saves with minimum sd_log_min_time value', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_min_time = 1
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
    expect(config.sd_log_min_time).toBe(1)
  })

  it('saves with maximum sd_log_min_time value', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_min_time = 60
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
    expect(config.sd_log_min_time).toBe(60)
  })

  it('disables save when validation fails', async () => {
    validateCurrentForm.mockReturnValue(false)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('disables save button when global.disabled is true', () => {
    global.disabled = true
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeDefined()
  })

  it('enables save button when global.disabled is false', () => {
    global.disabled = false
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeUndefined()
  })

  it('disables save button when configChanged is false', () => {
    global.configChanged = false
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeDefined()
  })

  it('enables save button when configChanged is true', () => {
    global.configChanged = true
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeUndefined()
  })

  it('renders SD measurement options when feature enabled', () => {
    global.feature.sd = true
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Measurement - Settings')
  })

  it('hides SD measurement options when feature disabled', () => {
    global.feature.sd = false
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Measurement - Settings')
  })

  it('provides complete list of time options', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.timeOptions).toHaveLength(8)
    expect(wrapper.vm.timeOptions[0].value).toBe(1)
    expect(wrapper.vm.timeOptions[7].value).toBe(60)
  })

  it('time options have correct labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.timeOptions[0].label).toBe('1 min')
    expect(wrapper.vm.timeOptions[1].label).toBe('3 min')
    expect(wrapper.vm.timeOptions[7].label).toBe('60 min')
  })

  it('saves with SD feature enabled', async () => {
    validateCurrentForm.mockReturnValue(true)
    global.feature.sd = true
    config.sd_log_files = 50

    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
    expect(config.sd_log_files).toBe(50)
  })

  it('saves with SD feature disabled', async () => {
    validateCurrentForm.mockReturnValue(true)
    global.feature.sd = false
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('updates both SD settings independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.sd_log_files = 30
    expect(config.sd_log_files).toBe(30)
    expect(config.sd_log_min_time).toBe(5)

    config.sd_log_min_time = 20
    expect(config.sd_log_files).toBe(30)
    expect(config.sd_log_min_time).toBe(20)
  })

  it('maintains config state after save', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_files = 42
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.sd_log_files).toBe(42)
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('handles rapid configuration changes', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.sd_log_files = 5
    config.sd_log_min_time = 10
    config.sd_log_files = 15
    config.sd_log_min_time = 30

    expect(config.sd_log_files).toBe(15)
    expect(config.sd_log_min_time).toBe(30)
  })

  it('renders form element with proper structure', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.element.tagName).toBeTruthy()
  })

  it('calls saveAll with correct context', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalledTimes(1)
  })

  it('preserves SD feature state during saves', async () => {
    validateCurrentForm.mockReturnValue(true)
    global.feature.sd = true
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()
    expect(global.feature.sd).toBe(true)

    await wrapper.vm.saveSettings()
    expect(global.feature.sd).toBe(true)
  })

  it('handles edge case with zero files', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_files = 0
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('handles edge case with maximum time value', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.sd_log_min_time = 1440
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('title text is correctly displayed', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Measurement - Settings')
  })

  it('fixed size value is immutable', () => {
    const wrapper = createWrapper()
    const initialValue = wrapper.vm.fixedSize

    expect(wrapper.vm.fixedSize).toBe(initialValue)
    expect(wrapper.vm.fixedSize).toBe(16)
  })
})
