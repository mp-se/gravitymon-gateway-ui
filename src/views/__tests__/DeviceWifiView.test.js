import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DeviceWifiView from '../DeviceWifiView.vue'
import { config, global } from '@/modules/pinia'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('DeviceWifiView', () => {
  const createWrapper = () =>
    mount(DeviceWifiView, {
      global: {
        stubs: {
          BsMessage: { template: '<div><slot /></div>' },
          BsSelect: true,
          BsInputText: true,
          BsInputNumber: true,
          BsInputSwitch: true,
          RouterLink: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    global.messageInfo = ''
    global.ui.enableManualWifiEntry = true
    global.ui.enableScanForStrongestAp = false
    config.wifi_ssid = ''
    config.wifi_ssid2 = ''
    config.runWifiScan.mockResolvedValue({
      success: true,
      data: {
        networks: [
          { wifi_ssid: 'Home', rssi: -45, encryption: 1, channel: 1 },
          { wifi_ssid: 'Home', rssi: -48, encryption: 1, channel: 6 },
          { wifi_ssid: 'Guest', rssi: -70, encryption: 0, channel: 11 }
        ]
      }
    })
  })

  it('renders wifi settings and the missing-network warning', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Device - WIFI')
    expect(wrapper.text()).toContain('define at least one wifi network')
  })

  it('loads and deduplicates scanned networks on mount', async () => {
    const wrapper = createWrapper()
    await vi.waitFor(() => {
      expect(wrapper.vm.scanning).toBe(false)
    })

    expect(config.runWifiScan).toHaveBeenCalled()
    expect(wrapper.vm.networks).toEqual([
      { label: '-blank-', value: '', rssi: 0, encryption: 0, channel: 0 },
      { label: 'Home 🔒 (Excellent)', value: 'Home', rssi: -45, encryption: 1, channel: 1 },
      { label: 'Guest (Poor)', value: 'Guest', rssi: -70, encryption: 0, channel: 11 }
    ])
  })

  it('formats wifi names by encryption and signal quality', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.wifiName('Strong', -45, true)).toBe('Strong 🔒 (Excellent)')
    expect(wrapper.vm.wifiName('Good', -55, false)).toBe('Good (Good)')
    expect(wrapper.vm.wifiName('Min', -65, false)).toBe('Min (Minimum)')
    expect(wrapper.vm.wifiName('Weak', -80, false)).toBe('Weak (Poor)')
  })

  it('saves wifi settings when the form is valid', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).toHaveBeenCalled()
    expect(global.messageInfo).toContain('restart the device')
  })

  it('does not save wifi settings when the form is invalid', async () => {
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
})