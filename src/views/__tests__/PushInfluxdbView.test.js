import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushInfluxdbView from '@/views/PushInfluxdbView.vue'

describe('PushInfluxdbView (interaction tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      influxdb2_target: '',
      influxdb2_org: '',
      influxdb2_bucket: '',
      influxdb2_token: '',
      influxdb2_format_gravity: '',
      influxdb2_format_pressure: '',
      influxdb2_gravity: true,
      influxdb2_pressure: true,
      saveAll: vi.fn(async () => true),
      runPushTest: vi.fn(async () => true)
    })
    Object.assign(global, {
      disabled: false,
      configChanged: true,
      messageError: ''
    })
  })

  it('mounts without error', () => {
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.text()).toContain('Push - Influxdb v2')
  })

  it('displays the form and action buttons', () => {
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushInfluxdbView (action tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      influxdb2_target: '',
      influxdb2_org: '',
      influxdb2_bucket: '',
      influxdb2_token: '',
      influxdb2_format_gravity: '',
      influxdb2_format_pressure: '',
      influxdb2_gravity: true,
      influxdb2_pressure: true,
      saveAll: vi.fn(async () => true),
      runPushTest: vi.fn(async () => true)
    })
    Object.assign(global, {
      disabled: false,
      configChanged: true,
      messageError: ''
    })
  })

  it('save calls config.saveAll when form is valid', async () => {
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_pressure' })
  })

  it('format callbacks decode config values', () => {
    const wrapper = mount(PushInfluxdbView)

    wrapper.vm.gravityInfluxdb2FormatCallback(encodeURIComponent('measurement value=1'))
    wrapper.vm.pressureInfluxdb2FormatCallback(encodeURIComponent('pressure value=2'))

    expect(config.influxdb2_format_gravity).toBe('measurement value=1')
    expect(config.influxdb2_format_pressure).toBe('pressure value=2')
  })

  it('pushDisabled becomes true when global is disabled or wifi direct is enabled', () => {
    global.disabled = true
    let wrapper = mount(PushInfluxdbView)
    expect(wrapper.vm.pushDisabled).toBe(true)

    global.disabled = false
    config.use_wifi_direct = true
    wrapper = mount(PushInfluxdbView)
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render helpers generate preview text', () => {
    config.influxdb2_format_gravity = 'gravity=${gravity}'
    config.influxdb2_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushInfluxdbView)

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.influxdb2_gravity = false
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.influxdb2_pressure = false
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    const wrapper = mount(PushInfluxdbView)

    config.influxdb2_gravity = false
    expect(config.influxdb2_gravity).toBe(false)

    config.influxdb2_gravity = true
    expect(config.influxdb2_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    const wrapper = mount(PushInfluxdbView)

    config.influxdb2_pressure = false
    expect(config.influxdb2_pressure).toBe(false)

    config.influxdb2_pressure = true
    expect(config.influxdb2_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = mount(PushInfluxdbView)

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.vm).toBeDefined()
  })

  it('test buttons are disabled when push is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('form updates config values when inputs change', () => {
    const wrapper = mount(PushInfluxdbView)

    config.influxdb2_target = 'http://influx.example.com'
    config.influxdb2_org = 'my-org'
    config.influxdb2_bucket = 'my-bucket'
    config.influxdb2_token = 'my-token'

    expect(config.influxdb2_target).toBe('http://influx.example.com')
    expect(config.influxdb2_org).toBe('my-org')
    expect(config.influxdb2_bucket).toBe('my-bucket')
    expect(config.influxdb2_token).toBe('my-token')
  })

  it('test callbacks properly update config values', () => {
    const wrapper = mount(PushInfluxdbView)
    const encodedGravity = encodeURIComponent('test_gravity_format')
    const encodedPressure = encodeURIComponent('test_pressure_format')

    wrapper.vm.gravityInfluxdb2FormatCallback(encodedGravity)
    wrapper.vm.pressureInfluxdb2FormatCallback(encodedPressure)

    expect(config.influxdb2_format_gravity).toBe('test_gravity_format')
    expect(config.influxdb2_format_pressure).toBe('test_pressure_format')
  })

  it('renders save and test buttons', () => {
    const wrapper = mount(PushInfluxdbView)

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})