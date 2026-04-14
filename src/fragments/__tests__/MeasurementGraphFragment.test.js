import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MeasurementGraphFragment from '../MeasurementGraphFragment.vue'
import { __chartInstances, Chart } from 'chart.js'

describe('MeasurementGraphFragment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __chartInstances.length = 0
  })

  it('registers chart components and creates a chart on mount', () => {
    const wrapper = mount(MeasurementGraphFragment, {
      props: {
        dataSet1: [{ x: new Date('2025-01-09T09:00:00Z'), y: 1.012 }],
        dataSet2: [{ x: new Date('2025-01-09T09:00:00Z'), y: 20.1 }],
        label1: 'Gravity',
        label2: 'Temperature'
      },
      attachTo: document.body
    })

    expect(Chart.register).toHaveBeenCalled()
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(__chartInstances).toHaveLength(1)
    expect(__chartInstances[0].data.datasets[0].label).toBe('Gravity')
  })

  it('updates the existing chart when model props change', async () => {
    const wrapper = mount(MeasurementGraphFragment, {
      props: {
        dataSet1: [{ x: 1, y: 1.012 }],
        dataSet2: [{ x: 1, y: 20.1 }],
        label1: 'Gravity',
        label2: 'Temperature'
      },
      attachTo: document.body
    })

    await wrapper.setProps({
      dataSet1: [{ x: 2, y: 1.01 }],
      dataSet2: [{ x: 2, y: 19.8 }],
      label1: 'SG',
      label2: 'Temp'
    })

    expect(__chartInstances[0].data.datasets[0].data).toEqual([{ x: 2, y: 1.01 }])
    expect(__chartInstances[0].data.datasets[1].label).toBe('Temp')
    expect(__chartInstances[0].update).toHaveBeenCalled()
  })
})
