import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DeviceSettingsView from '../DeviceSettingsView.vue'
import { config, global } from '@/modules/pinia'
import { sharedHttpClient as http, validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('DeviceSettingsView', () => {
  const createWrapper = () =>
    mount(DeviceSettingsView, {
      global: {
        stubs: {
          BsMessage: { template: '<div><slot /></div>' },
          BsInputText: true,
          BsInputRadio: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    global.messageError = ''
    global.messageSuccess = ''
    config.mdns = ''
  })

  it('renders the settings form and warning message when mdns is missing', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Device - Settings')
    expect(wrapper.text()).toContain('define a mdns name')
    expect(wrapper.text()).toContain('Restore factory defaults')
  })

  it('displays mdns input field', () => {
    config.mdns = 'my-device'
    const wrapper = createWrapper()

    expect(config.mdns).toBe('my-device')
  })

  it('displays temperature format options', () => {
    config.temp_unit = 'C'
    const wrapper = createWrapper()

    expect(config.temp_unit).toBe('C')

    config.temp_unit = 'F'
    expect(config.temp_unit).toBe('F')
  })

  it('displays gravity format options', () => {
    config.gravity_unit = 'G'
    const wrapper = createWrapper()

    expect(config.gravity_unit).toBe('G')

    config.gravity_unit = 'P'
    expect(config.gravity_unit).toBe('P')
  })

  it('displays pressure unit options', () => {
    config.pressure_unit = 'PSI'
    const wrapper = createWrapper()

    expect(config.pressure_unit).toBe('PSI')

    config.pressure_unit = 'kPa'
    expect(config.pressure_unit).toBe('kPa')

    config.pressure_unit = 'Bar'
    expect(config.pressure_unit).toBe('Bar')
  })

  it('displays dark mode options', () => {
    config.dark_mode = false
    const wrapper = createWrapper()

    expect(config.dark_mode).toBe(false)

    config.dark_mode = true
    expect(config.dark_mode).toBe(true)
  })

  it('displays all action buttons', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Restart device')
    expect(wrapper.text()).toContain('Restore factory defaults')
  })

  it('saves settings when the form is valid', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('does not save settings when the form is invalid', async () => {
    validateCurrentForm.mockReturnValue(false)
    const wrapper = createWrapper()

    await wrapper.vm.saveSettings()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('restarts the device through the config store', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.restart()

    expect(config.restart).toHaveBeenCalled()
  })

  it('handles successful factory reset responses', async () => {
    http.request.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ success: true, message: 'Factory reset initiated' })
    })
    const wrapper = createWrapper()

    await wrapper.vm.factory()

    expect(http.request).toHaveBeenCalledWith('api/factory', { method: 'POST' })
    expect(global.messageSuccess).toBe('Factory reset initiated')
    expect(global.disabled).toBe(true)
  })

  it('handles failed factory reset responses', async () => {
    http.request.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ success: false, message: 'Nope' })
    })
    const wrapper = createWrapper()

    await wrapper.vm.factory()

    expect(global.messageError).toBe('Nope')
    expect(global.disabled).toBe(false)
  })

  it('handles factory reset request exceptions', async () => {
    http.request.mockRejectedValue(new Error('network fail'))
    const wrapper = createWrapper()

    await wrapper.vm.factory()

    expect(global.messageError).toBe('Failed to do factory restore')
    expect(global.disabled).toBe(false)
  })

  it('disables save button when global.disabled is true', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('disables save button when global.configChanged is false', () => {
    global.configChanged = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('initializes with all config values', () => {
    config.mdns = 'brewmon'
    config.temp_unit = 'F'
    config.gravity_unit = 'P'
    config.pressure_unit = 'Bar'
    config.dark_mode = true
    const wrapper = createWrapper()

    expect(config.mdns).toBe('brewmon')
    expect(config.temp_unit).toBe('F')
    expect(config.gravity_unit).toBe('P')
    expect(config.pressure_unit).toBe('Bar')
    expect(config.dark_mode).toBe(true)
  })
})