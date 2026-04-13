import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DeviceWifiApView from '../DeviceWifiApView.vue'
import { config, global, status } from '@/modules/pinia'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'

describe('DeviceWifiApView', () => {
  const createWrapper = () =>
    mount(DeviceWifiApView, {
      global: {
        stubs: {
          BsInputText: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.configChanged = true
    global.messageInfo = ''
    status.id = 'ABC123'
    config.wifi_direct_ssid = ''
    config.wifi_direct_pass = ''
  })

  it('renders wifi AP configuration controls', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Device - WIFI AP')
    expect(wrapper.text()).toContain('Generate')
    expect(wrapper.text()).toContain('Restart device')
  })

  it('displays the wifi direct explanation', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Wifi Direct allows')
    expect(wrapper.text()).toContain('direct link between the two')
  })

  it('generate fills direct SSID with device id prefix', () => {
    const randomValues = BigUint64Array.from([123456789n, 987654321n])
    vi.spyOn(window.crypto, 'getRandomValues').mockReturnValue(randomValues)
    const wrapper = createWrapper()

    wrapper.vm.generate()

    expect(config.wifi_direct_ssid).toBe('gw-ABC123')
  })

  it('generate fills direct password with random string of exactly 10 characters', () => {
    const randomValues = BigUint64Array.from([123456789n, 987654321n])
    vi.spyOn(window.crypto, 'getRandomValues').mockReturnValue(randomValues)
    const wrapper = createWrapper()

    wrapper.vm.generate()

    expect(config.wifi_direct_pass).toHaveLength(10)
    expect(config.wifi_direct_pass).toMatch(/^[a-z0-9A-Z]+$/)
  })

  it('saves settings when the form is valid', () => {
    validateCurrentForm.mockReturnValue(true)
    config.wifi_direct_ssid = 'gw-test'
    config.wifi_direct_pass = 'test1234'
    const wrapper = createWrapper()

    wrapper.vm.save()

    expect(config.saveAll).toHaveBeenCalled()
    expect(global.messageInfo).toContain('restart the device')
  })

  it('does not save when validation fails', () => {
    validateCurrentForm.mockReturnValue(false)
    const wrapper = createWrapper()

    wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('restarts the device through the config store', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.restart()

    expect(config.restart).toHaveBeenCalled()
  })

  it('disables inputs when global.disabled is true', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
    expect(config.saveAll).toBeDefined()
  })

  it('disables save button when no changes are made', () => {
    global.configChanged = false
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button').find((b) => b.text().includes('Save'))

    expect(saveButton?.attributes('disabled')).toBeDefined()
  })

  it('enables save button when changes are made', () => {
    global.configChanged = true
    const wrapper = createWrapper()
    const saveButton = wrapper.findAll('button').find((b) => b.text().includes('Save'))

    expect(saveButton?.attributes('disabled')).toBeUndefined()
  })
})