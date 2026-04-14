import { beforeEach, describe, expect, it, vi } from 'vitest'
import { logError } from '@mp-se/espframework-ui-components'
import { global } from '@/modules/pinia'
import { applyTemplate } from '@/modules/utils'

describe('applyTemplate', () => {
  const status = {
    rssi: -42
  }

  const config = {
    temp_unit: 'C',
    gravity_unit: 'G',
    pressure_unit: 'PSI',
    mdns: 'gw-test',
    id: 'device-123',
    sleep_interval: 900,
    token: 'secret',
    isKPa: false,
    isBar: false
  }

  beforeEach(() => {
    global.app_ver = '2.5.0'
    global.app_build = '20260413'
    vi.clearAllMocks()
  })

  it('renders JSON templates with replaced placeholders', () => {
    const output = applyTemplate(
      status,
      config,
      '{"device":"${mdns}","id":"${id}","tempUnit":"${temp-unit}","gravityUnit":"${gravity-unit}","version":"${app-ver}","rssi":${rssi}}'
    )

    expect(JSON.parse(output)).toEqual({
      device: 'gw-test',
      id: 'device-123',
      tempUnit: 'C',
      gravityUnit: 'G',
      version: '2.5.0',
      rssi: -42
    })
  })

  it('returns a plain string when the template is not JSON', () => {
    const output = applyTemplate(status, config, 'device=${mdns}&rssi=${rssi}')

    expect(output).toBe('device=gw-test&rssi=-42')
    expect(logError).toHaveBeenCalledWith(
      'utils.applyTemplate()',
      'Not a valid json document, returning string'
    )
  })
})
