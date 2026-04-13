import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FirmwareView from '../FirmwareView.vue'
import { global } from '@/modules/pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

describe('FirmwareView', () => {
  const createWrapper = () =>
    mount(FirmwareView, {
      global: {
        stubs: {
          BsFileUpload: true,
          BsProgress: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.messageError = ''
    global.messageSuccess = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders firmware upload context and button state', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Firmware Upload')
    expect(wrapper.text()).toContain('Platform:')
    expect(wrapper.vm.hasFileSelected).toBe(false)
  })

  it('tracks file selection through the upload input change event', async () => {
    const wrapper = createWrapper()

    wrapper.vm.onFileChange({ target: { files: [new File(['fw'], 'firmware.bin')] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasFileSelected).toBe(true)
  })

  it('blocks upload when no file is selected', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [] })
    const wrapper = createWrapper()

    await wrapper.vm.upload()

    expect(global.messageError).toContain('select one file')
  })

  it('uploads firmware and reports success', async () => {
    const fakeFile = new File(['fw'], 'firmware.bin')
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [fakeFile] })
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => {})
    http.uploadFile.mockImplementation(async (_url, _file, options) => {
      options.onProgress(100)
      return { success: true }
    })
    const wrapper = createWrapper()

    await wrapper.vm.upload()

    expect(http.uploadFile).toHaveBeenCalledWith('api/firmware', fakeFile, expect.any(Object))
    expect(wrapper.vm.progress).toBe(100)
    expect(global.messageSuccess).toContain('waiting for device to restart')
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function), {
      once: true
    })
  })

  it('reports upload failures from the API response', async () => {
    const fakeFile = new File(['fw'], 'firmware.bin')
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [fakeFile] })
    http.uploadFile.mockResolvedValue({ success: false, status: 500 })
    const wrapper = createWrapper()

    await wrapper.vm.upload()

    expect(global.messageError).toBe('Upload failed: 500')
  })

  it('reports upload exceptions', async () => {
    const fakeFile = new File(['fw'], 'firmware.bin')
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [fakeFile] })
    http.uploadFile.mockRejectedValue(new Error('network error'))
    const wrapper = createWrapper()

    await wrapper.vm.upload()

    expect(global.messageError).toBe('Upload error: network error')
    expect(global.disabled).toBe(false)
  })
})