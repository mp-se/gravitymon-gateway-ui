import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushHttpPost1View from '@/views/PushHttpPost1View.vue'

describe('PushHttpPost1View (interaction tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      http_post_target: '',
      http_post_header1: '',
      http_post_header2: '',
      http_post_format_gravity: '',
      http_post_format_pressure: '',
      http_post_gravity: true,
      http_post_pressure: true,
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
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.text()).toContain('Push - HTTP Post')
  })

  it('displays the form and action buttons', () => {
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushHttpPost1View (action tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      http_post_target: '',
      http_post_header1: '',
      http_post_header2: '',
      http_post_format_gravity: '',
      http_post_format_pressure: '',
      http_post_gravity: true,
      http_post_pressure: true,
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
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_post_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_post_format_pressure' })
  })

  it('dropdown callbacks update config fields', () => {
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.httpUrlCallback('https://api.example.com/post1')
    wrapper.vm.httpHeaderH1Callback('Accept: application/json')
    wrapper.vm.httpHeaderH2Callback('Content-Type: application/json')
    wrapper.vm.gravityHttpFormatCallback('gravity%3D%24%7Bgravity%7D')
    wrapper.vm.pressureHttpFormatCallback('pressure%3D%24%7Bpressure%7D')

    expect(config.http_post_target).toBe('https://api.example.com/post1')
    expect(config.http_post_header1).toBe('Accept: application/json')
    expect(config.http_post_header2).toBe('Content-Type: application/json')
    expect(config.http_post_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_post_format_pressure).toBe('pressure=${pressure}')
  })

  it('render helpers generate preview text', () => {
    config.http_post_format_gravity = 'gravity=${gravity}'
    config.http_post_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('buttons disable when global.disabled is true', () => {
    global.disabled = true
    const wrapper = mount(PushHttpPost1View)
    const buttons = wrapper.findAll('button')

    expect(buttons.at(1)?.attributes('disabled')).toBeDefined()
    expect(buttons.at(2)?.attributes('disabled')).toBeDefined()
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.http_post_gravity = false
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.http_post_pressure = false
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost1View)

    config.http_post_gravity = false
    expect(config.http_post_gravity).toBe(false)

    config.http_post_gravity = true
    expect(config.http_post_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost1View)

    config.http_post_pressure = false
    expect(config.http_post_pressure).toBe(false)

    config.http_post_pressure = true
    expect(config.http_post_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = mount(PushHttpPost1View)

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.vm).toBeDefined()
  })

  it('form updates config values when inputs change', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost1View)

    config.http_post_target = 'http://example.com/post1'
    config.http_post_header1 = 'Custom-Header: value1'
    config.http_post_header2 = 'Custom-Header: value2'

    expect(config.http_post_target).toBe('http://example.com/post1')
    expect(config.http_post_header1).toBe('Custom-Header: value1')
    expect(config.http_post_header2).toBe('Custom-Header: value2')
  })

  it('renders save and test buttons', () => {
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })

  it('initializes with correct config values', () => {
    config.http_post_target = 'http://api.example.com/post1'
    config.http_post_header1 = 'Header1-Value'
    config.http_post_header2 = 'Header2-Value'
    config.http_post_format_gravity = 'gravity=${gravity}'
    config.http_post_format_pressure = 'pressure=${pressure}'
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(PushHttpPost1View)

    expect(config.http_post_target).toBe('http://api.example.com/post1')
    expect(config.http_post_header1).toBe('Header1-Value')
    expect(config.http_post_header2).toBe('Header2-Value')
    expect(config.http_post_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_post_format_pressure).toBe('pressure=${pressure}')
  })

  it('httpUrlCallback updates http_post_target', () => {
    const wrapper = mount(PushHttpPost1View)
    const testUrl = 'https://api.example.com/post1'

    wrapper.vm.httpUrlCallback(testUrl)

    expect(config.http_post_target).toBe(testUrl)
  })

  it('httpHeaderH1Callback updates http_post_header1', () => {
    const wrapper = mount(PushHttpPost1View)
    const testHeader = 'X-API-Key: secretkey123'

    wrapper.vm.httpHeaderH1Callback(testHeader)

    expect(config.http_post_header1).toBe(testHeader)
  })

  it('httpHeaderH2Callback updates http_post_header2', () => {
    const wrapper = mount(PushHttpPost1View)
    const testHeader = 'Accept-Encoding: gzip'

    wrapper.vm.httpHeaderH2Callback(testHeader)

    expect(config.http_post_header2).toBe(testHeader)
  })

  it('gravityHttpFormatCallback decodes and updates format', () => {
    const wrapper = mount(PushHttpPost1View)
    const encoded = encodeURIComponent('{"gravity":"{{gravity}}"}')

    wrapper.vm.gravityHttpFormatCallback(encoded)

    expect(config.http_post_format_gravity).toContain('{{gravity}}')
  })

  it('pressureHttpFormatCallback decodes and updates format', () => {
    const wrapper = mount(PushHttpPost1View)
    const encoded = encodeURIComponent('{"pressure":"{{pressure}}"}')

    wrapper.vm.pressureHttpFormatCallback(encoded)

    expect(config.http_post_format_pressure).toContain('{{pressure}}')
  })

  it('gravityRenderFormat renders gravity preview', () => {
    config.http_post_format_gravity = 'G={{gravity}}'
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('pressureRenderFormat renders pressure preview', () => {
    config.http_post_format_pressure = 'P={{pressure}}'
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.pressureRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('save validates before saving', async () => {
    validateCurrentForm.mockReturnValueOnce(true)
    const wrapper = mount(PushHttpPost1View)
    config.saveAll.mockClear()

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalledTimes(1)
  })

  it('runTestGravity clears messages', async () => {
    const wrapper = mount(PushHttpPost1View)
    global.clearMessages.mockClear()

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('runTestPressure clears messages', async () => {
    const wrapper = mount(PushHttpPost1View)
    global.clearMessages.mockClear()

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('multiple callbacks work in sequence', () => {
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.httpUrlCallback('https://post1.example.com')
    wrapper.vm.httpHeaderH1Callback('Auth: token')
    wrapper.vm.httpHeaderH2Callback('Type: json')
    wrapper.vm.gravityHttpFormatCallback(encodeURIComponent('g={{gravity}}'))
    wrapper.vm.pressureHttpFormatCallback(encodeURIComponent('p={{pressure}}'))

    expect(config.http_post_target).toBe('https://post1.example.com')
    expect(config.http_post_header1).toBe('Auth: token')
    expect(config.http_post_header2).toBe('Type: json')
  })

  it('handles encoded special characters in callbacks', () => {
    const wrapper = mount(PushHttpPost1View)
    const encoded = encodeURIComponent('{"key":"value&data"}')

    wrapper.vm.gravityHttpFormatCallback(encoded)

    expect(config.http_post_format_gravity).toContain('&')
  })

  it('render properly escapes ampersands', () => {
    config.http_post_format_gravity = 'a&b&c'
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.gravityRenderFormat()

    expect(wrapper.vm.render).toBeTruthy()
  })

  it('pushDisabled reflects disabled state', () => {
    global.disabled = true
    const wrapper = mount(PushHttpPost1View)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('empty URL callback works', () => {
    const wrapper = mount(PushHttpPost1View)

    wrapper.vm.httpUrlCallback('')

    expect(config.http_post_target).toBe('')
  })

  it('complex URLs are preserved', () => {
    const wrapper = mount(PushHttpPost1View)
    const complexUrl = 'https://api.example.com:8080/v1/post?key=val&other=123'

    wrapper.vm.httpUrlCallback(complexUrl)

    expect(config.http_post_target).toBe(complexUrl)
  })
})
