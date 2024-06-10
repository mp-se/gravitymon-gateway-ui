import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useStatusStore = defineStore('status', {
    state: () => {
        return {
            id: "",
            rssi: 0,
            app_ver: "",
            app_build: "",
            mdns: "",
            platform: "",
            wifi_ssid: "",
            ip: "",
            total_heap: 0,
            free_heap: 0,
            wifi_setup: false,
        }
    },
    getters: {
    },
    actions: {
        load(callback) {
            logInfo("statusStore.load()", "Fetching /api/status")
            fetch(global.baseURL + 'api/status', {
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("statusStore.load()", json)
                    this.id = json.id,
                        this.rssi = json.rssi,
                        this.app_ver = json.app_ver,
                        this.app_build = json.app_build,
                        this.mdns = json.mdns,
                        this.platform = json.platform,
                        this.wifi_ssid = json.wifi_ssid,
                        this.ip = json.ip,
                        this.total_heap = json.total_heap,
                        this.free_heap = json.free_heap,
                        this.wifi_setup = json.wifi_setup

                    this.total_heap = (Math.round(this.total_heap / 1024)).toFixed(0)
                    this.free_heap = (Math.round(this.free_heap / 1024)).toFixed(0)

                    logInfo("statusStore.load()", "Fetching /api/status completed")
                    callback(true)
                })
                .catch(err => {
                    logError("statusStore.load()", err)
                    callback(false)
                })
        },
        auth(callback) {
            logInfo("statusStore.auth()", "Fetching /api/auth")
            var base = btoa('gravitymon:password')

            fetch(global.baseURL + 'api/auth', {
                method: "GET",
                headers: { "Authorization": "Basic " + base },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logInfo("statusStore.auth()", "Fetching /api/auth completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("statusStore.auth()", err)
                    callback(false)
                })
        },
    }
})