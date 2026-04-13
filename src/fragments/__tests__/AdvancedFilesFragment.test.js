import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdvancedFilesFragment from '../AdvancedFilesFragment.vue'
import { global } from '@/modules/pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

describe('AdvancedFilesFragment', () => {
  const createWrapper = (props = {}) =>
    mount(AdvancedFilesFragment, {
      props,
      global: {
        stubs: {
          BsFileUpload: true,
          BsProgress: true,
          BsModalConfirm: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.messageError = ''
    global.messageSuccess = ''
  })

  it('renders upload section for filesystem mode', () => {
    const wrapper = createWrapper({ type: 'fs' })

    expect(wrapper.text()).toContain('Upload files to file system')
    expect(wrapper.text()).toContain('Delete files from file system')
  })

  it('renders SD-specific delete title', () => {
    const wrapper = createWrapper({ type: 'sd' })

    expect(wrapper.text()).toContain('Delete files from SD file system')
  })

  it('lists deletable files for filesystem mode', async () => {
    http.filesystemRequest.mockResolvedValue({
      success: true,
      text: JSON.stringify({ files: [{ file: '/config.json' }, { file: '/log.txt' }] })
    })
    const wrapper = createWrapper({ type: 'fs' })

    await wrapper.vm.listFilesDelete()

    expect(http.filesystemRequest).toHaveBeenCalledWith(expect.objectContaining({ command: 'dir' }))
    expect(wrapper.vm.filesDelete).toEqual(['/config.json', '/log.txt'])
  })

  it('lists deletable files for SD mode', async () => {
    http.postJson.mockResolvedValue({
      text: vi.fn().mockResolvedValue(JSON.stringify({ files: [{ file: '/sd/config.json' }] }))
    })
    const wrapper = createWrapper({ type: 'sd' })

    await wrapper.vm.listFilesDelete()

    expect(http.postJson).toHaveBeenCalledWith(
      'api/sd',
      expect.objectContaining({ command: 'dir' }),
      expect.any(Object)
    )
    expect(wrapper.vm.filesDelete).toEqual(['/sd/config.json'])
  })

  it('deletes a confirmed filesystem file', async () => {
    http.filesystemRequest.mockResolvedValue({ success: true })
    const wrapper = createWrapper({ type: 'fs' })

    wrapper.vm.confirmDeleteFile = '/delete-me.txt'
    await wrapper.vm.confirmDeleteCallback(true)

    expect(http.filesystemRequest).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'del', file: '/delete-me.txt' })
    )
  })

  it('tracks selected file state from input changes', async () => {
    const wrapper = createWrapper({ type: 'fs' })

    wrapper.vm.onFileChange({ target: { files: [new File(['data'], 'fw.bin')] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasFileSelected).toBe(true)
  })

  it('uploads file and reports success with progress', async () => {
    const fakeFile = new File(['data'], 'fw.bin')
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [fakeFile] })
    http.uploadFile.mockImplementation(async (_url, _file, options) => {
      options.onProgress(100)
      return { success: true }
    })
    const wrapper = createWrapper({ type: 'fs' })

    await wrapper.vm.upload()

    expect(http.uploadFile).toHaveBeenCalledWith(
      'api/filesystem/upload',
      fakeFile,
      expect.any(Object)
    )
    expect(wrapper.vm.progress).toBe(100)
    expect(global.messageSuccess).toContain('completed')
  })

  it('reports an error when upload is attempted without a selected file', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue({ files: [] })
    const wrapper = createWrapper({ type: 'fs' })

    await wrapper.vm.upload()

    expect(global.messageError).toContain('select one file')
  })
})