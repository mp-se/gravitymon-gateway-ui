import { defineStore } from 'pinia'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      id: '',
      rssi: 0,
      mdns: '',
      wifi_ssid: '',
      ip: '',
      total_heap: 0,
      free_heap: 0,
      wifi_setup: false,

      gravity_device: [],
      pressure_device: [],
      temperature_device: [],

      uptime_seconds: 0,
      uptime_minutes: 0,
      uptime_hours: 0,
      uptime_days: 0,

      sd_enbled: false,

      // Values that are not updated but needed for format template viewer
      angle: 35,
      gravity: 1.015,
      pressure: 1.23,
      temp: 20.1,
      battery: 4.0
    }
  },
  getters: {},
  actions: {
    async load() {
      logInfo('statusStore.load()', 'Fetching /api/status')
      try {
        const json = await http.getJson('api/status')
        logDebug('statusStore.load()', json)

        this.id = json.id
        this.rssi = json.rssi
        this.mdns = json.mdns
        this.wifi_ssid = json.wifi_ssid
        this.ip = json.ip
        this.total_heap = json.total_heap
        this.free_heap = json.free_heap
        this.wifi_setup = json.wifi_setup

        this.gravity_device = json.gravity_device
        this.pressure_device = json.pressure_device
        this.temperature_device = json.temperature_device

        this.uptime_seconds = json.uptime_seconds
        this.uptime_minutes = json.uptime_minutes
        this.uptime_hours = json.uptime_hours
        this.uptime_days = json.uptime_days

        this.sd_mounted = json.sd_mounted

        this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
        this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

        logInfo('statusStore.load()', 'Fetching /api/status completed')
        return true
      } catch (err) {
        logError('statusStore.load()', err)
        return false
      }
    }
  }
})
