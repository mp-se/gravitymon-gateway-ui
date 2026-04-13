import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListFilesFragment from '../ListFilesFragment.vue'
import { global } from '@/modules/pinia'
import {
  isValidFormData,
  isValidJson,
  isValidMqttData,
  sharedHttpClient as http
} from '@mp-se/espframework-ui-components'

describe('ListFilesFragment', () => {
  const createWrapper = (type = 'fs') =>
    mount(ListFilesFragment, {
      props: { type },
      global: {
        stubs: {
          BsProgress: true
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    global.disabled = false
    global.messageError = ''
    global.messageSuccess = ''
    isValidJson.mockReturnValue(false)
    isValidFormData.mockReturnValue(false)
    isValidMqttData.mockReturnValue(false)
  })

  it('renders the filesystem title and list button for fs mode', () => {
    const wrapper = createWrapper('fs')

    expect(wrapper.text()).toContain('Explore the file system')
    expect(wrapper.text()).toContain('List files')
  })

  it('renders the filesystem title and list button for SD mode', () => {
    const wrapper = createWrapper('sd')

    expect(wrapper.text()).toContain('Explore the SD file system')
    expect(wrapper.text()).toContain('List SD files')
  })

  it('lists files and calculates usage for filesystem mode', async () => {
    http.filesystemRequest.mockResolvedValue({
      success: true,
      text: JSON.stringify({
        files: [{ file: '/config.json' }, { file: '/log.txt' }],
        used: 512,
        total: 1024,
        free: 512
      })
    })
    const wrapper = createWrapper('fs')

    await wrapper.vm.listFilesView()

    expect(http.filesystemRequest).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'dir', timeoutMs: 20000 })
    )
    expect(wrapper.vm.filesView).toEqual(['/config.json', '/log.txt'])
    expect(wrapper.vm.filesystemUsage).toBe(50)
    expect(wrapper.vm.filesystemUsageText).toContain('Total space 1 KB')
  })

  it('lists files for SD mode via postJson', async () => {
    http.postJson.mockResolvedValue({
      text: vi.fn().mockResolvedValue(JSON.stringify({ files: [{ file: '/sd/data.csv' }] }))
    })
    const wrapper = createWrapper('sd')

    await wrapper.vm.listFilesView()

    expect(http.postJson).toHaveBeenCalledWith(
      'api/sd',
      expect.objectContaining({ command: 'dir' }),
      expect.any(Object)
    )
    expect(wrapper.vm.filesView).toEqual(['/sd/data.csv'])
  })

  it('loads and colorizes JSON file contents', async () => {
    isValidJson.mockReturnValue(true)
    http.filesystemRequest.mockResolvedValue({ success: true, text: '{"key":"value"}' })
    const wrapper = createWrapper('fs')

    await wrapper.vm.viewFile('/config.json')

    expect(wrapper.vm.dataType).toBe('json')
    expect(wrapper.vm.fileData).toContain('"key"')
    expect(wrapper.vm.fileDataSize).toBe(15)
  })

  it('loads secure disk file contents through request()', async () => {
    http.request.mockResolvedValue({ text: vi.fn().mockResolvedValue('plain text') })
    const wrapper = createWrapper('sd')

    await wrapper.vm.viewFile('/notes.txt')

    expect(http.request).toHaveBeenCalledWith('sd/notes.txt', {
      method: 'GET',
      timeoutMs: 20000
    })
    expect(wrapper.vm.dataType).toBe('text')
    expect(wrapper.vm.fileData).toBe('plain text')
  })

  it('formats file sizes across units', () => {
    const wrapper = createWrapper('fs')

    expect(wrapper.vm.formatFileSize(2048)).toBe('2 KB')
    expect(wrapper.vm.formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
    expect(wrapper.vm.formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2.0 GB')
  })

  it('detects and renders binary content as hex', async () => {
    http.filesystemRequest.mockResolvedValue({ success: true, text: `A${String.fromCharCode(0)}B` })
    const wrapper = createWrapper('fs')

    await wrapper.vm.viewFile('/binary.dat')

    expect(wrapper.vm.dataType).toBe('binary')
    expect(wrapper.vm.fileData).toContain('41 00 42')
  })
})