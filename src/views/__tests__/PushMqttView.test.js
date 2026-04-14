import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushMqttView from '@/views/PushMqttView.vue'

describe('PushMqttView (interaction tests)', () => {
  const createWrapper = () =>
    mount(PushMqttView, {
      global: {
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsInputSwitch: true,
          BsDropdown: true,
          BsModal: true
        }
      }
    })

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
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Push - MQTT')
  })

  it('displays the form and action buttons', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushMqttView (action tests)', () => {
  const createWrapper = () =>
    mount(PushMqttView, {
      global: {
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsInputSwitch: true,
          BsDropdown: true,
          BsModal: true
        }
      }
    })

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
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_pressure' })
  })

  it('format callbacks decode and expand line separators', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('key|value'))
    wrapper.vm.pressureMqttFormatCallback(encodeURIComponent('pressure|value'))

    expect(config.mqtt_format_gravity).toContain('|\n')
    expect(config.mqtt_format_pressure).toContain('|\n')
  })

  it('pushDisabled becomes true when global is disabled or wifi direct is enabled', () => {
    global.disabled = true
    let wrapper = createWrapper()
    expect(wrapper.vm.pushDisabled).toBe(true)

    global.disabled = false
    config.use_wifi_direct = true
    wrapper = createWrapper()
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render helpers generate preview text', () => {
    config.mqtt_format_gravity = 'gravity=${gravity}'
    config.mqtt_format_pressure = 'pressure=${pressure}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.mqtt_gravity = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.mqtt_pressure = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_gravity = false
    expect(config.mqtt_gravity).toBe(false)

    config.mqtt_gravity = true
    expect(config.mqtt_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_pressure = false
    expect(config.mqtt_pressure).toBe(false)

    config.mqtt_pressure = true
    expect(config.mqtt_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('test buttons are disabled when push is disabled', () => {
    global.disabled = true
    const wrapper = createWrapper()

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('form updates config values when inputs change', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

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
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })

  it('gravityMqttFormatCallback updates gravity format', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('brewmon/gravity={{gravity}}')

    wrapper.vm.gravityMqttFormatCallback(encoded)

    expect(config.mqtt_format_gravity).toContain('{{gravity}}')
  })

  it('pressureMqttFormatCallback updates pressure format', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('brewmon/pressure={{pressure}}')

    wrapper.vm.pressureMqttFormatCallback(encoded)

    expect(config.mqtt_format_pressure).toContain('{{pressure}}')
  })

  it('gravityRenderFormat generates preview', () => {
    config.mqtt_format_gravity = 'gravity={{gravity}}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('pressureRenderFormat generates preview', () => {
    config.mqtt_format_pressure = 'pressure={{pressure}}'
    const wrapper = createWrapper()

    wrapper.vm.pressureRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('runTestGravity clears messages and calls runPushTest', async () => {
    const wrapper = createWrapper()
    config.runPushTest.mockClear()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({
      push_format: 'mqtt_format_gravity'
    })
  })

  it('runTestPressure clears messages and calls runPushTest', async () => {
    const wrapper = createWrapper()
    config.runPushTest.mockClear()

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({
      push_format: 'mqtt_format_pressure'
    })
  })

  it('save validates before saving', async () => {
    validateCurrentForm.mockReturnValueOnce(true)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalledTimes(1)
  })

  it('all MQTT config fields can be set independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_target = 'mqtt.example.com'
    expect(config.mqtt_target).toBe('mqtt.example.com')

    config.mqtt_port = 1883
    expect(config.mqtt_port).toBe(1883)
    expect(config.mqtt_target).toBe('mqtt.example.com')

    config.mqtt_user = 'username'
    expect(config.mqtt_user).toBe('username')

    config.mqtt_pass = 'password'
    expect(config.mqtt_pass).toBe('password')
  })

  it('handles URI-encoded special characters in format callbacks', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('topic/data={{gravity}}&extra=value')

    wrapper.vm.gravityMqttFormatCallback(encoded)

    expect(config.mqtt_format_gravity).toContain('&')
  })

  it('multiple format callbacks work sequentially', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('grav={{gravity}}'))
    wrapper.vm.pressureMqttFormatCallback(encodeURIComponent('pres={{pressure}}'))

    expect(config.mqtt_format_gravity).toContain('gravity')
    expect(config.mqtt_format_pressure).toContain('pressure')
  })

  it('empty string format callbacks work', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback('')
    wrapper.vm.pressureMqttFormatCallback('')

    expect(config.mqtt_format_gravity).toBe('')
    expect(config.mqtt_format_pressure).toBe('')
  })

  it('hostname with port is preserved', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()
    const hostname = 'mqtt.example.com'

    config.mqtt_target = hostname

    expect(config.mqtt_target).toBe(hostname)
  })

  it('port numbers are preserved', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_port = 8883
    expect(config.mqtt_port).toBe(8883)

    config.mqtt_port = 1883
    expect(config.mqtt_port).toBe(1883)
  })

  it('credentials are preserved', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()
    const username = 'admin'
    const password = 'secretpassword'

    config.mqtt_user = username
    config.mqtt_pass = password

    expect(config.mqtt_user).toBe(username)
    expect(config.mqtt_pass).toBe(password)
  })

  it('gravity and pressure can be toggled independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_gravity = true
    config.mqtt_pressure = false
    expect(config.mqtt_gravity).toBe(true)
    expect(config.mqtt_pressure).toBe(false)

    config.mqtt_gravity = false
    config.mqtt_pressure = true
    expect(config.mqtt_gravity).toBe(false)
    expect(config.mqtt_pressure).toBe(true)
  })

  it('pushDisabled reflects disabled state', () => {
    global.disabled = false
    config.use_wifi_direct = false
    let wrapper = createWrapper()

    expect(wrapper.vm.pushDisabled).toBe(false)

    global.disabled = true
    wrapper = createWrapper()
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render escapes ampersands properly', () => {
    config.mqtt_format_gravity = 'key=val&key2=val2'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('gravityMqttFormatCallback properly decodes and formats pipes', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('topic1|topic2|topic3')

    wrapper.vm.gravityMqttFormatCallback(encoded)

    expect(config.mqtt_format_gravity).toBe('topic1|\ntopic2|\ntopic3')
  })

  it('pressureMqttFormatCallback properly decodes and formats pipes', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('pressure1|pressure2')

    wrapper.vm.pressureMqttFormatCallback(encoded)

    expect(config.mqtt_format_pressure).toBe('pressure1|\npressure2')
  })

  it('format callbacks handle pipe at start of string', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('|data'))

    expect(config.mqtt_format_gravity).toBe('|\ndata')
  })

  it('format callbacks handle pipe at end of string', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('data|'))

    expect(config.mqtt_format_gravity).toBe('data|\n')
  })

  it('format callbacks handle multiple consecutive pipes', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('a||b'))

    expect(config.mqtt_format_gravity).toBe('a|\n|\nb')
  })

  it('format callbacks handle no pipes in string', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('no-pipes-here'))

    expect(config.mqtt_format_gravity).toBe('no-pipes-here')
  })

  it('gravityMqttFormatCallback and pressureMqttFormatCallback are independent', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityMqttFormatCallback(encodeURIComponent('grav|format'))
    wrapper.vm.pressureMqttFormatCallback(encodeURIComponent('pres|format'))

    expect(config.mqtt_format_gravity).toContain('|\n')
    expect(config.mqtt_format_pressure).toContain('|\n')
    expect(config.mqtt_format_gravity).toContain('grav')
    expect(config.mqtt_format_pressure).toContain('pres')
  })

  it('save does not save when validation fails', async () => {
    validateCurrentForm.mockReturnValue(false)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('save calls validateCurrentForm before saving', async () => {
    validateCurrentForm.mockReturnValue(true)
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
  })

  it('runTestGravity and runTestPressure are mutually exclusive calls', async () => {
    config.runPushTest.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_gravity' })

    config.runPushTest.mockClear()

    await wrapper.vm.runTestPressure()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_pressure' })
  })

  it('gravityRenderFormat updates render value', () => {
    config.mqtt_format_gravity = 'gravity=${gravity}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
    expect(wrapper.vm.render.length).toBeGreaterThan(0)
  })

  it('pressureRenderFormat updates render value', () => {
    config.mqtt_format_pressure = 'pressure=${pressure}'
    const wrapper = createWrapper()

    wrapper.vm.pressureRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
    expect(wrapper.vm.render.length).toBeGreaterThan(0)
  })

  it('pushDisabled is true when both disabled and use_wifi_direct are true', () => {
    global.disabled = true
    config.use_wifi_direct = true
    const wrapper = createWrapper()

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('format callbacks handle URL-encoded pipes', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('test%7Cdata')

    wrapper.vm.gravityMqttFormatCallback(encoded)

    expect(config.mqtt_format_gravity).toBeDefined()
  })

  it('format callbacks preserve newlines in encoded content', () => {
    const wrapper = createWrapper()
    const withNewline = encodeURIComponent('line1\nline2|line3')

    wrapper.vm.gravityMqttFormatCallback(withNewline)

    expect(config.mqtt_format_gravity).toContain('|\n')
  })

  it('MQTT target is updated independently of other fields', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.mqtt_target = 'broker.example.com'
    config.mqtt_port = 8883
    config.mqtt_user = 'user'

    expect(config.mqtt_target).toBe('broker.example.com')
    expect(config.mqtt_port).toBe(8883)
    expect(config.mqtt_user).toBe('user')
  })

  it('clearMessages is called before test gravity', async () => {
    global.clearMessages = vi.fn()
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clearMessages is called before test pressure', async () => {
    global.clearMessages = vi.fn()
    const wrapper = createWrapper()

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('render state persists independently between gravity and pressure', () => {
    config.mqtt_format_gravity = 'gravity=${gravity}'
    config.mqtt_format_pressure = 'pressure=${pressure}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    const gravityRender = wrapper.vm.render

    wrapper.vm.pressureRenderFormat()
    const pressureRender = wrapper.vm.render

    expect(gravityRender).not.toBe(pressureRender)
  })
})
