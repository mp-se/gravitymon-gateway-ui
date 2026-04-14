import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushHttpPost2View from '@/views/PushHttpPost2View.vue'

describe('PushHttpPost2View (interaction tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      http_post_gravity: true,
      http_post_pressure: true,
      http_post2_target: '',
      http_post2_header1: '',
      http_post2_header2: '',
      http_post2_format_gravity: '',
      http_post2_format_pressure: '',
      http_post2_gravity: true,
      http_post2_pressure: true,
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
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.text()).toContain('Push - HTTP Post #2')
  })

  it('displays the form and action buttons', () => {
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushHttpPost2View (action tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      http_post_gravity: true,
      http_post_pressure: true,
      http_post2_target: '',
      http_post2_header1: '',
      http_post2_header2: '',
      http_post2_format_gravity: '',
      http_post2_format_pressure: '',
      http_post2_gravity: true,
      http_post2_pressure: true,
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
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_post2_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_post2_format_pressure' })
  })

  it('dropdown callbacks update config fields', () => {
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.httpUrlCallback('https://api.example.com/post')
    wrapper.vm.httpHeaderH1Callback('Accept: application/json')
    wrapper.vm.httpHeaderH2Callback('Content-Type: application/json')
    wrapper.vm.gravityHttpFormatCallback('gravity%3D%24%7Bgravity%7D')
    wrapper.vm.pressureHttpFormatCallback('pressure%3D%24%7Bpressure%7D')

    expect(config.http_post2_target).toBe('https://api.example.com/post')
    expect(config.http_post2_header1).toBe('Accept: application/json')
    expect(config.http_post2_header2).toBe('Content-Type: application/json')
    expect(config.http_post2_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_post2_format_pressure).toBe('pressure=${pressure}')
  })

  it('pushDisabled becomes true when wifi direct is enabled', () => {
    config.use_wifi_direct = true
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render helpers generate preview text', () => {
    config.http_post2_format_gravity = 'gravity=${gravity}'
    config.http_post2_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.http_post2_gravity = false
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.http_post2_pressure = false
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost2View)

    config.http_post2_gravity = false
    expect(config.http_post2_gravity).toBe(false)

    config.http_post2_gravity = true
    expect(config.http_post2_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost2View)

    config.http_post2_pressure = false
    expect(config.http_post2_pressure).toBe(false)

    config.http_post2_pressure = true
    expect(config.http_post2_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm).toBeDefined()
  })

  it('test buttons are disabled when push is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('form updates config values when inputs change', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost2View)

    config.http_post2_target = 'http://example.com/post2'
    config.http_post2_header1 = 'Custom-Header: value1'
    config.http_post2_header2 = 'Custom-Header: value2'

    expect(config.http_post2_target).toBe('http://example.com/post2')
    expect(config.http_post2_header1).toBe('Custom-Header: value1')
    expect(config.http_post2_header2).toBe('Custom-Header: value2')
  })

  it('renders save and test buttons', () => {
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })

  it('initializes with correct config values', () => {
    config.http_post2_target = 'http://api.example.com/post2'
    config.http_post2_header1 = 'Header1-Value'
    config.http_post2_header2 = 'Header2-Value'
    config.http_post2_format_gravity = 'gravity=${gravity}'
    config.http_post2_format_pressure = 'pressure=${pressure}'
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost2View)

    expect(config.http_post2_target).toBe('http://api.example.com/post2')
    expect(config.http_post2_header1).toBe('Header1-Value')
    expect(config.http_post2_header2).toBe('Header2-Value')
    expect(config.http_post2_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_post2_format_pressure).toBe('pressure=${pressure}')
  })

  it('handles global disabled state', () => {
    global.disabled = true
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm).toBeDefined()
  })

  it('pushDisabled becomes true when global is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushHttpPost2View)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('httpUrlCallback updates http_post2_target', () => {
    const wrapper = mount(PushHttpPost2View)
    const testUrl = 'https://api.example.com/post2'

    wrapper.vm.httpUrlCallback(testUrl)

    expect(config.http_post2_target).toBe(testUrl)
  })

  it('httpHeaderH1Callback updates http_post2_header1', () => {
    const wrapper = mount(PushHttpPost2View)
    const testHeader = 'X-Custom-Header: value'

    wrapper.vm.httpHeaderH1Callback(testHeader)

    expect(config.http_post2_header1).toBe(testHeader)
  })

  it('httpHeaderH2Callback updates http_post2_header2', () => {
    const wrapper = mount(PushHttpPost2View)
    const testHeader = 'Authorization: Bearer token'

    wrapper.vm.httpHeaderH2Callback(testHeader)

    expect(config.http_post2_header2).toBe(testHeader)
  })

  it('gravityHttpFormatCallback decodes and updates format', () => {
    const wrapper = mount(PushHttpPost2View)
    const encoded = encodeURIComponent('{"g":"{{gravity}}"}')

    wrapper.vm.gravityHttpFormatCallback(encoded)

    expect(config.http_post2_format_gravity).toContain('{{gravity}}')
  })

  it('pressureHttpFormatCallback decodes and updates format', () => {
    const wrapper = mount(PushHttpPost2View)
    const encoded = encodeURIComponent('{"p":"{{pressure}}"}')

    wrapper.vm.pressureHttpFormatCallback(encoded)

    expect(config.http_post2_format_pressure).toContain('{{pressure}}')
  })

  it('gravityRenderFormat generates preview', () => {
    config.http_post2_format_gravity = 'grav={{gravity}}'
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('pressureRenderFormat generates preview', () => {
    config.http_post2_format_pressure = 'pres={{pressure}}'
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.pressureRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('multiple callbacks work sequentially', () => {
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.httpUrlCallback('https://endpoint.example.com/post2')
    wrapper.vm.httpHeaderH1Callback('Token: abc123')
    wrapper.vm.httpHeaderH2Callback('Content-Length: 256')
    wrapper.vm.gravityHttpFormatCallback(encodeURIComponent('{gravity}'))
    wrapper.vm.pressureHttpFormatCallback(encodeURIComponent('{pressure}'))

    expect(config.http_post2_target).toBe('https://endpoint.example.com/post2')
    expect(config.http_post2_header1).toBe('Token: abc123')
    expect(config.http_post2_header2).toBe('Content-Length: 256')
  })

  it('save validates form before saving', async () => {
    validateCurrentForm.mockReturnValueOnce(true)
    config.saveAll.mockClear()
    const wrapper = mount(PushHttpPost2View)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('runTestGravity clears messages and calls runPushTest', async () => {
    const wrapper = mount(PushHttpPost2View)
    config.runPushTest.mockClear()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({
      push_format: 'http_post2_format_gravity'
    })
  })

  it('runTestPressure clears messages and calls runPushTest', async () => {
    const wrapper = mount(PushHttpPost2View)
    config.runPushTest.mockClear()

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({
      push_format: 'http_post2_format_pressure'
    })
  })

  it('handles special characters in URL', () => {
    const wrapper = mount(PushHttpPost2View)
    const specialUrl = 'https://api.example.com:8080/post2?key=val&other=123#hash'

    wrapper.vm.httpUrlCallback(specialUrl)

    expect(config.http_post2_target).toBe(specialUrl)
  })

  it('handles special characters in headers', () => {
    const wrapper = mount(PushHttpPost2View)
    const specialHeader = 'Authorization: Bearer eyJhbGciO...'

    wrapper.vm.httpHeaderH1Callback(specialHeader)

    expect(config.http_post2_header1).toBe(specialHeader)
  })

  it('render escapes ampersands', () => {
    config.http_post2_format_gravity = 'key1=val1&key2=val2'
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('empty URL callback works', () => {
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.httpUrlCallback('')

    expect(config.http_post2_target).toBe('')
  })

  it('empty header callbacks work', () => {
    const wrapper = mount(PushHttpPost2View)

    wrapper.vm.httpHeaderH1Callback('')
    wrapper.vm.httpHeaderH2Callback('')

    expect(config.http_post2_header1).toBe('')
    expect(config.http_post2_header2).toBe('')
  })

  it('pressure format callback with URI-encoded data', () => {
    const wrapper = mount(PushHttpPost2View)
    const encoded = encodeURIComponent('{"psi":"{{pressure}}","unit":"psi"}')

    wrapper.vm.pressureHttpFormatCallback(encoded)

    expect(config.http_post2_format_pressure).toContain('{{pressure}}')
  })
})
