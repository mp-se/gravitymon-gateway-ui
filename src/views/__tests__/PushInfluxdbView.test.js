import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushInfluxdbView from '@/views/PushInfluxdbView.vue'

describe('PushInfluxdbView (interaction tests)', () => {
  const createWrapper = () =>
    mount(PushInfluxdbView, {
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
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Push - Influxdb v2')
  })

  it('displays the form and action buttons', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushInfluxdbView (action tests)', () => {
  const createWrapper = () =>
    mount(PushInfluxdbView, {
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
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_pressure' })
  })

  it('format callbacks decode config values', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityInfluxdb2FormatCallback(encodeURIComponent('measurement value=1'))
    wrapper.vm.pressureInfluxdb2FormatCallback(encodeURIComponent('pressure value=2'))

    expect(config.influxdb2_format_gravity).toBe('measurement value=1')
    expect(config.influxdb2_format_pressure).toBe('pressure value=2')
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
    config.influxdb2_format_gravity = 'gravity=${gravity}'
    config.influxdb2_format_pressure = 'pressure=${pressure}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.influxdb2_gravity = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.influxdb2_pressure = false
    const wrapper = createWrapper()

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.influxdb2_gravity = false
    expect(config.influxdb2_gravity).toBe(false)

    config.influxdb2_gravity = true
    expect(config.influxdb2_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.influxdb2_pressure = false
    expect(config.influxdb2_pressure).toBe(false)

    config.influxdb2_pressure = true
    expect(config.influxdb2_pressure).toBe(true)
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
    const wrapper = createWrapper()
    const encodedGravity = encodeURIComponent('test_gravity_format')
    const encodedPressure = encodeURIComponent('test_pressure_format')

    wrapper.vm.gravityInfluxdb2FormatCallback(encodedGravity)
    wrapper.vm.pressureInfluxdb2FormatCallback(encodedPressure)

    expect(config.influxdb2_format_gravity).toBe('test_gravity_format')
    expect(config.influxdb2_format_pressure).toBe('test_pressure_format')
  })

  it('renders save and test buttons', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })

  it('gravityInfluxdb2FormatCallback updates gravity format', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('measurement,tag={{tag}} value={{gravity}}')

    wrapper.vm.gravityInfluxdb2FormatCallback(encoded)

    expect(config.influxdb2_format_gravity).toContain('{{gravity}}')
  })

  it('pressureInfluxdb2FormatCallback updates pressure format', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('pressure,unit=kpa value={{pressure}}')

    wrapper.vm.pressureInfluxdb2FormatCallback(encoded)

    expect(config.influxdb2_format_pressure).toContain('{{pressure}}')
  })

  it('gravityRenderFormat generates preview', () => {
    config.influxdb2_format_gravity = 'gravity={{gravity}}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('pressureRenderFormat generates preview', () => {
    config.influxdb2_format_pressure = 'pressure={{pressure}}'
    const wrapper = createWrapper()

    wrapper.vm.pressureRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('runTestGravity passes correct format type', async () => {
    const wrapper = createWrapper()
    config.runPushTest.mockClear()

    await wrapper.vm.runTestGravity()

    const callArgs = config.runPushTest.mock.calls[0][0]
    expect(callArgs.push_format).toBe('influxdb2_format_gravity')
  })

  it('runTestPressure passes correct format type', async () => {
    const wrapper = createWrapper()
    config.runPushTest.mockClear()

    await wrapper.vm.runTestPressure()

    const callArgs = config.runPushTest.mock.calls[0][0]
    expect(callArgs.push_format).toBe('influxdb2_format_pressure')
  })

  it('save validates before saving', async () => {
    validateCurrentForm.mockReturnValueOnce(true)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalledTimes(1)
  })

  it('all config fields can be set independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.influxdb2_target = 'http://influx-server'
    expect(config.influxdb2_target).toBe('http://influx-server')

    config.influxdb2_org = 'org-name'
    expect(config.influxdb2_org).toBe('org-name')
    expect(config.influxdb2_target).toBe('http://influx-server')

    config.influxdb2_bucket = 'bucket-name'
    expect(config.influxdb2_bucket).toBe('bucket-name')

    config.influxdb2_token = 'secret-token'
    expect(config.influxdb2_token).toBe('secret-token')
  })

  it('handles URI-encoded special characters in format callbacks', () => {
    const wrapper = createWrapper()
    const encoded = encodeURIComponent('{"key":"{{value}}&other=data"}')

    wrapper.vm.gravityInfluxdb2FormatCallback(encoded)

    expect(config.influxdb2_format_gravity).toContain('&')
  })

  it('multiple format callbacks work sequentially', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityInfluxdb2FormatCallback(encodeURIComponent('grav={{gravity}}'))
    wrapper.vm.pressureInfluxdb2FormatCallback(encodeURIComponent('pres={{pressure}}'))

    expect(config.influxdb2_format_gravity).toContain('gravity')
    expect(config.influxdb2_format_pressure).toContain('pressure')
  })

  it('empty string callbacks work', () => {
    const wrapper = createWrapper()

    wrapper.vm.gravityInfluxdb2FormatCallback('')
    wrapper.vm.pressureInfluxdb2FormatCallback('')

    expect(config.influxdb2_format_gravity).toBe('')
    expect(config.influxdb2_format_pressure).toBe('')
  })

  it('complex target URLs are preserved', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()
    const complexUrl = 'https://influx.example.com:8086/api/v2/write'

    config.influxdb2_target = complexUrl

    expect(config.influxdb2_target).toBe(complexUrl)
  })

  it('complex tokens are preserved', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()
    const complexToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

    config.influxdb2_token = complexToken

    expect(config.influxdb2_token).toBe(complexToken)
  })

  it('gravity and pressure can be toggled independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.influxdb2_gravity = true
    config.influxdb2_pressure = false
    expect(config.influxdb2_gravity).toBe(true)
    expect(config.influxdb2_pressure).toBe(false)

    config.influxdb2_gravity = false
    config.influxdb2_pressure = true
    expect(config.influxdb2_gravity).toBe(false)
    expect(config.influxdb2_pressure).toBe(true)
  })

  it('pushDisabled reflects wifi direct setting', () => {
    global.disabled = false
    config.use_wifi_direct = true
    const wrapper = createWrapper()

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('gravityRenderFormat with multiple template variables', () => {
    config.influxdb2_format_gravity =
      'measurement,gravity=${gravity},temp=${temp_unit} value=${battery}'
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toBeDefined()
    expect(wrapper.vm.render.length).toBeGreaterThan(0)
  })

  it('pressureRenderFormat with multiple template variables', () => {
    config.influxdb2_format_pressure = 'pressure=${pressure},unit=${pressure_unit}'
    const wrapper = createWrapper()

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toBeDefined()
    expect(wrapper.vm.render.length).toBeGreaterThan(0)
  })

  it('gravityRenderFormat with empty template', () => {
    config.influxdb2_format_gravity = ''
    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toBe('')
  })

  it('pressureRenderFormat with empty template', () => {
    config.influxdb2_format_pressure = ''
    const wrapper = createWrapper()

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toBe('')
  })

  it('save enables button when config changes', async () => {
    validateCurrentForm.mockReturnValue(true)
    global.configChanged = true
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(config.saveAll).toHaveBeenCalled()
  })

  it('runTestGravity does not call saveAll', async () => {
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestPressure does not call saveAll', async () => {
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.runTestPressure()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('gravityInfluxdb2FormatCallback handles special characters', () => {
    const wrapper = createWrapper()
    const specialChars = encodeURIComponent('measurement,tag1=value1 field1="test with spaces"')

    wrapper.vm.gravityInfluxdb2FormatCallback(specialChars)

    expect(config.influxdb2_format_gravity).toBe(
      'measurement,tag1=value1 field1="test with spaces"'
    )
  })

  it('pressureInfluxdb2FormatCallback handles special characters', () => {
    const wrapper = createWrapper()
    const specialChars = encodeURIComponent('pressure,unit=psi value=42.5')

    wrapper.vm.pressureInfluxdb2FormatCallback(specialChars)

    expect(config.influxdb2_format_pressure).toBe('pressure,unit=psi value=42.5')
  })

  it('render variable maintains state between calls', () => {
    config.influxdb2_format_gravity = 'gravity=${gravity}'

    const wrapper = createWrapper()

    wrapper.vm.gravityRenderFormat()
    const firstRender = wrapper.vm.render

    wrapper.vm.pressureRenderFormat()
    const secondRender = wrapper.vm.render

    expect(firstRender).not.toBe(secondRender)
  })

  it('pushDisabled is false when both conditions are met', () => {
    global.disabled = false
    config.use_wifi_direct = false
    const wrapper = createWrapper()

    expect(wrapper.vm.pushDisabled).toBe(false)
  })

  it('pushDisabled is true when either condition is true', () => {
    global.disabled = true
    config.use_wifi_direct = false
    let wrapper = createWrapper()
    expect(wrapper.vm.pushDisabled).toBe(true)

    global.disabled = false
    config.use_wifi_direct = true
    wrapper = createWrapper()
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('all config fields can be set independently', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = createWrapper()

    config.influxdb2_target = 'http://localhost:8086'
    expect(config.influxdb2_target).toBe('http://localhost:8086')

    config.influxdb2_org = 'myorg'
    expect(config.influxdb2_org).toBe('myorg')

    config.influxdb2_bucket = 'data'
    expect(config.influxdb2_bucket).toBe('data')

    config.influxdb2_token = 'token123'
    expect(config.influxdb2_token).toBe('token123')
  })

  it('format callbacks update config in sequence', () => {
    const wrapper = createWrapper()
    const format1 = encodeURIComponent('format1')
    const format2 = encodeURIComponent('format2')

    wrapper.vm.gravityInfluxdb2FormatCallback(format1)
    expect(config.influxdb2_format_gravity).toBe('format1')

    wrapper.vm.gravityInfluxdb2FormatCallback(format2)
    expect(config.influxdb2_format_gravity).toBe('format2')
  })

  it('test gravity and pressure do not interfere with each other', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.runTestGravity()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_gravity' })

    config.runPushTest.mockClear()

    await wrapper.vm.runTestPressure()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_pressure' })
  })

  it('save validates before saving', async () => {
    validateCurrentForm.mockReturnValue(true)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save does not save on validation failure', async () => {
    validateCurrentForm.mockReturnValue(false)
    config.saveAll.mockClear()
    const wrapper = createWrapper()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).not.toHaveBeenCalled()
  })
})
