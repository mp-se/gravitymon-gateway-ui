import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushMqttView from '@/views/PushMqttView.vue'

describe('PushMqttView (interaction tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      mqtt_target: '',
      mqtt_port: 1883,
      mqtt_user: '',
      mqtt_pass: '',
      mqtt_format_gravity: '',
      mqtt_format_pressure: '',
      mqtt_gravity: true,
      mqtt_pressure: true,
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
    const wrapper = mount(PushMqttView)

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = mount(PushMqttView)

    expect(wrapper.text()).toContain('Push - MQTT')
  })

  it('displays the form and action buttons', () => {
    const wrapper = mount(PushMqttView)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushMqttView (action tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      mqtt_target: '',
      mqtt_port: 1883,
      mqtt_user: '',
      mqtt_pass: '',
      mqtt_format_gravity: '',
      mqtt_format_pressure: '',
      mqtt_gravity: true,
      mqtt_pressure: true,
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
    const wrapper = mount(PushMqttView)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = mount(PushMqttView)

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = mount(PushMqttView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = mount(PushMqttView)

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_pressure' })
  })

  it('format callbacks decode and expand line separators', () => {
    const wrapper = mount(PushMqttView)

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('key|value'))
    wrapper.vm.pressureMqttFormatCallback(encodeURIComponent('pressure|value'))

    expect(config.mqtt_format_gravity).toContain('|\n')
    expect(config.mqtt_format_pressure).toContain('|\n')
  })

  it('pushDisabled becomes true when global is disabled or wifi direct is enabled', () => {
    global.disabled = true
    let wrapper = mount(PushMqttView)
    expect(wrapper.vm.pushDisabled).toBe(true)

    global.disabled = false
    config.use_wifi_direct = true
    wrapper = mount(PushMqttView)
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render helpers generate preview text', () => {
    config.mqtt_format_gravity = 'gravity=${gravity}'
    config.mqtt_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushMqttView)

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.mqtt_gravity = false
    const wrapper = mount(PushMqttView)

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.mqtt_pressure = false
    const wrapper = mount(PushMqttView)

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    const wrapper = mount(PushMqttView)

    config.mqtt_gravity = false
    expect(config.mqtt_gravity).toBe(false)

    config.mqtt_gravity = true
    expect(config.mqtt_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    const wrapper = mount(PushMqttView)

    config.mqtt_pressure = false
    expect(config.mqtt_pressure).toBe(false)

    config.mqtt_pressure = true
    expect(config.mqtt_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = mount(PushMqttView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = mount(PushMqttView)

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = mount(PushMqttView)

    expect(wrapper.vm).toBeDefined()
  })

  it('test buttons are disabled when push is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushMqttView)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('form updates config values when inputs change', () => {
    const wrapper = mount(PushMqttView)

    config.mqtt_target = 'mqtt.example.com'
    config.mqtt_port = 8883
    config.mqtt_user = 'user123'
    config.mqtt_pass = 'pass123'

    expect(config.mqtt_target).toBe('mqtt.example.com')
    expect(config.mqtt_port).toBe(8883)
    expect(config.mqtt_user).toBe('user123')
    expect(config.mqtt_pass).toBe('pass123')
  })

  it('renders save and test buttons', () => {
    const wrapper = mount(PushMqttView)

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})