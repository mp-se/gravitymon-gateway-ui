import { defineStore } from 'pinia'
import { logInfo, logDebug, logError } from '@/modules/logger'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',
      board: '',
      app_ver: '',
      app_build: '',
      firmware_file: '',

      feature: {
        tft: false,
        sd: false
      },

      initialized: false,
      disabled: false,
      configChanged: false,

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: '',

      fetchTimout: 8000,
      url: undefined
    }
  },
  getters: {
    isError() {
      return this.messageError != '' ? true : false
    },
    isWarning() {
      return this.messageWarning != '' ? true : false
    },
    isSuccess() {
      return this.messageSuccess != '' ? true : false
    },
    isInfo() {
      return this.messageInfo != '' ? true : false
    },
    token() {
      return 'Bearer ' + this.id
    },
    baseURL() {
      if (this.url !== undefined) return this.url

      if (import.meta.env.VITE_APP_HOST === undefined) {
        logInfo(
          'configStore:baseURL()',
          'Using base URL from browser',
          window.location.href,
          import.meta.env
        )
        this.url = window.location.href
      } else {
        logInfo('configStore:baseURL()', 'Using base URL from env', import.meta.env.VITE_APP_HOST)
        this.url = import.meta.env.VITE_APP_HOST
      }

      return this.url
    },
    uiVersion() {
      return import.meta.env.VITE_APP_VERSION
    },
    uiBuild() {
      return import.meta.env.VITE_APP_BUILD
    },
    disabled32() {
      if (this.disabled) return true

      if (this.platform !== 'esp8266') return false

      return true
    }
  },
  actions: {
    clearMessages() {
      this.messageError = ''
      this.messageWarning = ''
      this.messageSuccess = ''
      this.messageInfo = ''
    },
    load(callback) {
      logInfo('globalStore.load()', 'Fetching /api/feature')
      fetch(this.baseURL + 'api/feature', {
        signal: AbortSignal.timeout(this.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('globalStore.load()', json)
          this.board = json.board.toUpperCase()
          this.app_ver = json.app_ver
          this.app_build = json.app_build
          this.platform = json.platform.toUpperCase()
          this.firmware_file = json.firmware_file.toLowerCase()

          this.feature.tft = json.tft
          this.feature.sd = json.sd

          logInfo('globalStore.load()', 'Fetching /api/feature completed')
          callback(true)
        })
        .catch((err) => {
          logError('globalStore.load()', err)
          callback(false)
        })
    }
  }
})
