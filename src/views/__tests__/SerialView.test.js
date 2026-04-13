import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SerialView from '../SerialView.vue'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

describe('SerialView', () => {
  let handlers
  let socket

  beforeEach(() => {
    vi.clearAllMocks()
    handlers = {}
    socket = { close: vi.fn() }
    http.createWebSocket.mockImplementation((_path, nextHandlers) => {
      handlers = nextHandlers
      if (handlers.onOpen) handlers.onOpen()
      return {
        close: vi.fn(() => {
          if (handlers.onClose) handlers.onClose()
        }),
        socketGetter: () => socket
      }
    })
  })

  it('connects on mount and shows connected status', async () => {
    const wrapper = mount(SerialView)

    await wrapper.vm.$nextTick()

    expect(http.createWebSocket).toHaveBeenCalledWith('serialws', expect.any(Object))
    expect(wrapper.vm.connected).toBe('Connected')
    expect(wrapper.vm.serial).toContain('Websocket established')
  })

  it('clears serial output', () => {
    const wrapper = mount(SerialView)
    wrapper.vm.serial = 'line 1\nline 2'

    wrapper.vm.clear()

    expect(wrapper.vm.serial).toBe('')
  })

  it('appends websocket data and trims excessive lines', () => {
    const wrapper = mount(SerialView)
    wrapper.vm.serial = Array.from({ length: 60 }, (_, index) => `line ${index}`).join('\n')

    handlers.onMessage({ data: 'tail' })

    expect(wrapper.vm.serial).toContain('tail')
    expect(wrapper.vm.serial.split('\n').length).toBeLessThanOrEqual(51)
  })

  it('records websocket errors and close events', () => {
    const wrapper = mount(SerialView)

    handlers.onError(new Error('broken pipe'))
    handlers.onClose()

    expect(wrapper.vm.serial).toContain('broken pipe')
    expect(wrapper.vm.serial).toContain('Socket closed')
    expect(wrapper.vm.isConnected).toBe(false)
  })

  it('closes the websocket on unmount', () => {
    const closeSpy = vi.fn()
    http.createWebSocket.mockImplementation((_path, nextHandlers) => {
      handlers = nextHandlers
      return {
        close: closeSpy,
        socketGetter: () => socket
      }
    })
    const wrapper = mount(SerialView)

    wrapper.unmount()

    expect(closeSpy).toHaveBeenCalled()
  })
})