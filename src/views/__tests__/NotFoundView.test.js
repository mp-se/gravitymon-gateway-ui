import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundView from '../NotFoundView.vue'

describe('NotFoundView', () => {
  it('renders the not found message', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        mocks: {
          $route: {
            path: '/missing-page'
          }
        },
        stubs: {
          BsMessage: { template: '<div><slot /></div>' }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text().toLowerCase()).toContain('not found')
    expect(wrapper.text()).toContain('/missing-page')
  })
})