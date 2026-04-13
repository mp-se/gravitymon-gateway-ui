import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EnableCorsFragment from '../EnableCorsFragment.vue'
import { global } from '@/modules/pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

describe('EnableCorsFragment', () => {
  const createWrapper = () => mount(EnableCorsFragment)

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.messageError = ''
    global.messageSuccess = ''
  })

  it('renders developer settings controls', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('h5').text()).toBe('Developer settings')
    expect(wrapper.text()).toContain('Enable CORS')
  })

  it('posts updated config and sets a success message', async () => {
    http.postJson.mockResolvedValue({})
    const wrapper = createWrapper()

    await wrapper.vm.enableCors()

    expect(http.postJson).toHaveBeenCalledWith('api/config', { cors_allowed: true })
    expect(global.messageSuccess).toContain('please reboot')
  })

  it('sets an error message when the config request fails', async () => {
    http.postJson.mockRejectedValue(new Error('network fail'))
    const wrapper = createWrapper()

    await wrapper.vm.enableCors()

    expect(global.messageError).toBe('Failed to enable CORS.')
  })

  it('handles failures while clearing existing messages', async () => {
    global.clearMessages.mockImplementationOnce(() => {
      throw new Error('clear failed')
    })
    const wrapper = createWrapper()

    await wrapper.vm.enableCors()

    expect(global.messageError).toContain('Failed to enable CORS: clear failed')
  })
})