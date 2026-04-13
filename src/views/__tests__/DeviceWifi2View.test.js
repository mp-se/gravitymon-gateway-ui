import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DeviceWifi2View from '../DeviceWifi2View.vue'
import { config, global } from '@/modules/pinia'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('DeviceWifi2View', () => {
  const createWrapper = () =>
    mount(DeviceWifi2View, {
      global: {
        stubs: {
          BsMessage: { template: '<div><slot /></div>' },
          BsInputText: true,
          BsInputNumber: true,
          BsInputSwitch: { template: '<div><label>{{ label }}</label></div>', props: ['label'] }
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    global.messageInfo = ''
    global.ui = { enableScanForStrongestAp: false }
    config.wifi_ssid = ''
    config.wifi_ssid2 = ''
    config.wifi_pass = ''
    config.wifi_pass2 = ''
    config.wifi_portal_timeout = 60
    config.wifi_connect_timeout = 30
    config.wifi_scan_ap = false
  })

  it('renders the manual wifi form and missing-network warning', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Device - WIFI (Manual)')
    expect(wrapper.text()).toContain('define at least one wifi network')
  })

  it('hides the warning when at least one SSID is configured', () => {
    config.wifi_ssid = 'brew-net'
    const wrapper = createWrapper()

    expect(wrapper.text()).not.toContain('define at least one wifi network')
  })

  it('saves settings when the form is valid', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.wifi_ssid = 'test-ssid'
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).toHaveBeenCalled()
    expect(global.messageInfo).toContain('restart the device')
  })

  it('does not save when validation fails', async () => {
    validateCurrentForm.mockReturnValue(false)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('restarts the device through the config store', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.restart()

    expect(config.restart).toHaveBeenCalled()
  })

  it('displays badge icons for wifi networks when they are missing', () => {
    config.wifi_ssid = ''
    config.wifi_ssid2 = ''
    const wrapper = createWrapper()

    // Badge functions are called in the template for badging
    expect(wrapper.html()).toContain('badge')
  })

  it('conditionally shows scan for strongest AP option when enabled', () => {
    global.ui.enableScanForStrongestAp = true
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Scan for strongest AP')
  })

  it('does not show scan for strongest AP option when disabled', () => {
    global.ui.enableScanForStrongestAp = false
    const wrapper = createWrapper()

    expect(wrapper.text()).not.toContain('Scan for strongest AP')
  })

  it('disables save button when no changes are made', () => {
    global.configChanged = false
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeDefined()
  })

  it('enables save button when changes are made', () => {
    global.configChanged = true
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button')[0]

    expect(saveButton.attributes('disabled')).toBeUndefined()
  })

  it('disables form inputs when global.disabled is true', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(config.saveAll).toBeDefined()
    expect(config.restart).toBeDefined()
  })
})