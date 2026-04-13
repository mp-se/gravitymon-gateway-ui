import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { global, status } from '@/modules/pinia'
import ToolsView from '@/views/ToolsView.vue'

describe('ToolsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(global, {
      disabled: false
    })
    Object.assign(status, {
      sd_mounted: false
    })
  })

  it('renders the heading and internal flash file fragments by default', () => {
    const wrapper = mount(ToolsView)

    expect(wrapper.text()).toContain('Tools')
    expect(wrapper.vm.fileSystem).toBe(0)
    expect(wrapper.vm.hideAdvanced).toBe(true)
  })

  it('shows filesystem options when an SD card is mounted', () => {
    status.sd_mounted = true
    const wrapper = mount(ToolsView)

    expect(wrapper.vm.fileSystemOptions).toEqual([
      { label: 'Internal Flash', value: 0 },
      { label: 'Secure Digital (SD)', value: 1 }
    ])
    expect(status.sd_mounted).toBe(true)
  })

  it('toggles advanced tools on when enableAdvanced is called', async () => {
    const wrapper = mount(ToolsView)

    expect(wrapper.vm.hideAdvanced).toBe(true)
    wrapper.vm.enableAdvanced()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hideAdvanced).toBe(false)
  })

  it('switches between internal flash and SD modes through the radio control', async () => {
    status.sd_mounted = true
    const radioStub = {
      template:
        '<select @change="$emit(\'update:modelValue\', Number($event.target.value))"><option value="0">Internal</option><option value="1">SD</option></select>',
      props: ['modelValue', 'options', 'label', 'width'],
      emits: ['update:modelValue']
    }
    const wrapper = mount(ToolsView, {
      global: {
        stubs: {
          BsInputRadio: radioStub
        }
      }
    })

    await wrapper.find('select').setValue('1')

    expect(wrapper.vm.fileSystem).toBe(1)
  })

  it('disables the advanced button when the global store is disabled', () => {
    global.disabled = true
    const wrapper = mount(ToolsView)
    const button = wrapper.find('button')

    expect(button.attributes('disabled')).toBeDefined()
  })
})