import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VoltageFragment from '../VoltageFragment.vue'
import { config, global, status } from '@/modules/pinia'

describe('VoltageFragment', () => {
  const createWrapper = () =>
    mount(VoltageFragment, {
      global: {
        stubs: {
          BsInputNumber: true,
          BsInputReadonly: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.messageError = ''
    global.messageInfo = ''
    config.voltage_factor = 1
    status.battery = 4
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders voltage factor controls', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('h5').text()).toContain('Calculate a new voltage factor')
    expect(wrapper.text()).toContain('Calculate factor')
  })

  it('shows an error for invalid measured voltage', async () => {
    const wrapper = createWrapper()
    wrapper.vm.measuredVoltage = 'nan'

    wrapper.vm.calculateFactor()
    await wrapper.vm.$nextTick()

    expect(global.messageError).toBe('Not a valid measurement')
  })

  it('updates factor, saves config, and reloads status on valid input', async () => {
    vi.useFakeTimers()
    const wrapper = createWrapper()
    wrapper.vm.measuredVoltage = 4.2

    wrapper.vm.calculateFactor()
    await Promise.resolve()
    await vi.runAllTimersAsync()

    expect(config.sendConfig).toHaveBeenCalled()
    expect(status.load).toHaveBeenCalled()
    expect(parseFloat(config.voltage_factor)).toBeCloseTo(1.05, 1)
    expect(global.messageInfo).toContain('New factor applied')
    expect(global.disabled).toBe(false)
  })
})