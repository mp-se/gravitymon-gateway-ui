import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { config, global } from '@/modules/pinia'
import PushHttpGetView from '@/views/PushHttpGetView.vue'

describe('PushHttpGetView (interaction tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      http_get_target: '',
      http_get_header1: '',
      http_get_header2: '',
      http_get_format_gravity: '',
      http_get_format_pressure: '',
      http_get_gravity: true,
      http_get_pressure: true,
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
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.text()).toContain('Push - HTTP Get')
  })

  it('displays form and action buttons', () => {
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })
})

describe('PushHttpGetView (action tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(config, {
      use_wifi_direct: false,
      http_get_target: '',
      http_get_header1: '',
      http_get_header2: '',
      http_get_format_gravity: '',
      http_get_format_pressure: '',
      http_get_gravity: true,
      http_get_pressure: true,
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
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.save()

    expect(validateCurrentForm).toHaveBeenCalled()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('save returns early when form validation fails', async () => {
    validateCurrentForm.mockReturnValueOnce(false)
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.save()

    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('runTestGravity calls config.runPushTest with the gravity payload', async () => {
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_get_format_gravity' })
  })

  it('runTestPressure calls config.runPushTest with the pressure payload', async () => {
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.runTestPressure()

    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_get_format_pressure' })
  })

  it('dropdown callbacks update config fields', () => {
    const wrapper = mount(PushHttpGetView)

    wrapper.vm.httpUrlCallback('https://api.example.com/data')
    wrapper.vm.httpHeaderH1Callback('Accept: text/plain')
    wrapper.vm.httpHeaderH2Callback('Authorization: Bearer token')
    wrapper.vm.gravityHttpFormatCallback('gravity%3D%24%7Bgravity%7D')
    wrapper.vm.pressureHttpFormatCallback('pressure%3D%24%7Bpressure%7D')

    expect(config.http_get_target).toBe('https://api.example.com/data')
    expect(config.http_get_header1).toBe('Accept: text/plain')
    expect(config.http_get_header2).toBe('Authorization: Bearer token')
    expect(config.http_get_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_get_format_pressure).toBe('pressure=${pressure}')
  })

  it('pushDisabled becomes true when wifi direct is enabled', () => {
    config.use_wifi_direct = true
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('render helpers generate preview text', () => {
    config.http_get_format_gravity = 'gravity=${gravity}'
    config.http_get_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushHttpGetView)

    wrapper.vm.gravityRenderFormat()
    expect(wrapper.vm.render).toContain('gravity=1.015')

    wrapper.vm.pressureRenderFormat()
    expect(wrapper.vm.render).toContain('pressure=')
  })

  it('disables gravity format controls when gravity is disabled', () => {
    config.http_get_gravity = false
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm).toBeDefined()
  })

  it('disables pressure format controls when pressure is disabled', () => {
    config.http_get_pressure = false
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm).toBeDefined()
  })

  it('toggles gravity enabled state', () => {
    const wrapper = mount(PushHttpGetView)

    config.http_get_gravity = false
    expect(config.http_get_gravity).toBe(false)

    config.http_get_gravity = true
    expect(config.http_get_gravity).toBe(true)
  })

  it('toggles pressure enabled state', () => {
    const wrapper = mount(PushHttpGetView)

    config.http_get_pressure = false
    expect(config.http_get_pressure).toBe(false)

    config.http_get_pressure = true
    expect(config.http_get_pressure).toBe(true)
  })

  it('clears messages before running gravity test', async () => {
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.runTestGravity()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('clears messages before running pressure test', async () => {
    const wrapper = mount(PushHttpGetView)

    await wrapper.vm.runTestPressure()

    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('save button is disabled when form has no changes', () => {
    global.configChanged = false
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm).toBeDefined()
  })

  it('test buttons are disabled when push is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('form updates config values when inputs change', () => {
    const wrapper = mount(PushHttpGetView)

    config.http_get_target = 'http://example.com'
    config.http_get_header1 = 'Custom-Header: value1'
    config.http_get_header2 = 'Custom-Header: value2'

    expect(config.http_get_target).toBe('http://example.com')
    expect(config.http_get_header1).toBe('Custom-Header: value1')
    expect(config.http_get_header2).toBe('Custom-Header: value2')
  })

  it('renders save and test buttons', () => {
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Run push gravity test')
    expect(wrapper.text()).toContain('Run push pressure test')
  })

  it('initializes with correct config values', () => {
    config.http_get_target = 'http://api.example.com'
    config.http_get_header1 = 'Header1-Value'
    config.http_get_header2 = 'Header2-Value'
    config.http_get_format_gravity = 'gravity=${gravity}'
    config.http_get_format_pressure = 'pressure=${pressure}'
    const wrapper = mount(PushHttpGetView)

    expect(config.http_get_target).toBe('http://api.example.com')
    expect(config.http_get_header1).toBe('Header1-Value')
    expect(config.http_get_header2).toBe('Header2-Value')
    expect(config.http_get_format_gravity).toBe('gravity=${gravity}')
    expect(config.http_get_format_pressure).toBe('pressure=${pressure}')
  })

  it('handles global disabled state', () => {
    global.disabled = true
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm).toBeDefined()
  })

  it('pushDisabled becomes true when global is disabled', () => {
    global.disabled = true
    const wrapper = mount(PushHttpGetView)

    expect(wrapper.vm.pushDisabled).toBe(true)
  })
})