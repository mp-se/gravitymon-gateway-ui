import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { getErrorString } from '@/modules/utils'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            // Device
            id: "",
            mdns: "",
            temp_format: "",
            gravity_format: "",
            dark_mode: false,
            // Hardware
            ble_active_scan: false,
            ble_scan_time: 5,
            timezone: "CET-1CEST,M3.5.0,M10.5.0/3",
            // Wifi
            wifi_portal_timeout: 0,
            wifi_connect_timeout: 0,
            wifi_ssid: "",
            wifi_ssid2: "",
            wifi_pass: "",
            wifi_pass2: "",
            wifi_direct_ssid: "",
            wifi_direct_pass: "",
            // Push - Generic
            token: "",
            push_timeout: 0,
            push_resend_time: 300,
            // Push - Http Post 1
            http_post_target: "",
            http_post_header1: "",
            http_post_header2: "",
            http_post_format: "",

            // Values that are not updated but needed for format template viewer
            sleep_interval: 900,
        }
    },
    actions: {
        toJson() {
            logInfo("configStore.toJSON()")
            var dest = {}

            for (var key in this.$state) {
                if (!key.startsWith("$")) {
                    dest[key] = this[key]
                }
            }

            logInfo("configStore.toJSON()", dest)
            return JSON.stringify(dest, null, 2)
        },
        load(callback) {
            global.disabled = true
            logInfo("configStore.load()", "Fetching /api/config")
            fetch(global.baseURL + 'api/config', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.load()", json)

                    global.disabled = false
                    this.id = json.id
                    // Device
                    this.mdns = json.mdns
                    this.temp_format = json.temp_format
                    this.gravity_format = json.gravity_format
                    this.dark_mode = json.dark_mode
                    // Hardware
                    this.ble_active_scan = json.ble_active_scan
                    this.ble_scan_time = json.ble_scan_time
                    this.timezone = json.timezone
                    // Wifi
                    this.wifi_portal_timeout = json.wifi_portal_timeout
                    this.wifi_connect_timeout = json.wifi_connect_timeout
                    this.wifi_ssid = json.wifi_ssid
                    this.wifi_ssid2 = json.wifi_ssid2
                    this.wifi_pass = json.wifi_pass
                    this.wifi_pass2 = json.wifi_pass2
                    this.wifi_direct_ssid = json.wifi_direct_ssid
                    this.wifi_direct_pass = json.wifi_direct_pass
                    // Push - Generic
                    this.token = json.token
                    this.push_timeout = json.push_timeout
                    this.push_resend_time = json.push_resend_time
                    // Push - Http Post 1
                    this.http_post_target = json.http_post_target
                    this.http_post_header1 = json.http_post_header1
                    this.http_post_header2 = json.http_post_header2
                    this.http_post_int = json.http_post_int
                    this.http_post_format = json.http_post_format
                    callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    logError("configStore.load()", err)
                    callback(false)
                })
        },
        loadFormat(callback) {
            global.disabled = true
            logInfo("configStore.loadFormat()", "Fetching /api/format")
            fetch(global.baseURL + 'api/format', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.loadFormat()", json)
                    global.disabled = false
                    this.http_post_format = decodeURIComponent(json.http_post_format)
                    callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    logError("configStore.loadFormat()", err)
                    callback(false)
                })
        },
        sendConfig(callback) {
            global.disabled = true
            logInfo("configStore.sendConfig()", "Sending /api/config")

            var data = getConfigChanges()
            delete data.http_post_format
            logDebug("configStore.sendConfig()", data)

            if (JSON.stringify(data).length == 2) {
                logInfo("configStore.sendConfig()", "No config data to store, skipping step")
                global.disabled = false
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/config', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        logError("configStore.sendConfig()", "Sending /api/config failed", res.status)
                        callback(false)
                    }
                    else {
                        logInfo("configStore.sendConfig()", "Sending /api/config completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendConfig()", err)
                    callback(false)
                    global.disabled = false
                })
        },
        sendFormat(callback) {
            global.disabled = true
            logInfo("configStore.sendFormat()", "Sending /api/format")

            var data2 = getConfigChanges()
            var data = {}
            var cnt = 0

            logDebug("configStore.sendFormat()", data)

            data = data2.http_post_format !== undefined ? { http_post_format: encodeURIComponent(data2.http_post_format) } : {}
            this.sendOneFormat(data, (success) => {
                callback(success)
            })
        },
        sendOneFormat(data, callback) {
            logInfo("configStore.sendOneFormat()", "Sending /api/format")

            if (JSON.stringify(data).length == 2) {
                logInfo("configStore.sendOneFormat()", "No format data to store, skipping step")
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/format', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        logError("configStore.sendOneFormat()", "Sending /api/format failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendOneFormat()", "Sending /api/format completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendOneFormat()", err)
                    callback(false)
                })
        },
        sendPushTest(data, callback) {
            global.disabled = true
            logInfo("configStore.sendPushTest()", "Sending /api/push")
            fetch(global.baseURL + 'api/push', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    if (res.status != 200) {
                        logError("configStore.sendPushTest()", "Sending /api/push failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendPushTest()", "Sending /api/push completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendPushTest()", err)
                    callback(false)
                })
        },
        getPushTestStatus(callback) {
            logInfo("configStore.getPushTest()", "Fetching /api/push/status")
            fetch(global.baseURL + 'api/push/status', {
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.getPushTest()", json)
                    logInfo("configStore.getPushTest()", "Fetching /api/push/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("configStore.getPushTest()", err)
                    callback(false, null)
                })
        },
        sendWifiScan(callback) {
            global.disabled = true
            logInfo("configStore.sendWifiScan()", "Sending /api/wifi")
            fetch(global.baseURL + 'api/wifi', {
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    if (res.status != 200) {
                        logError("configStore.sendWifiScan()", "Sending /api/wifi failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendWifiScan()", "Sending /api/wifi completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendWifiScan()", err)
                    callback(false)
                })
        },
        getWifiScanStatus(callback) {
            logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status")
            fetch(global.baseURL + 'api/wifi/status', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.getWifiScanStatus()", json)
                    logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("configStore.getWifiScanStatus()", err)
                    callback(false, null)
                })
        },
        saveAll() {
            global.clearMessages()
            global.disabled = true
            this.sendConfig((success) => {
                if (!success) {
                    global.disabled = false
                    global.messageError = "Failed to store configuration to device"
                } else {
                    this.sendFormat((success) => {
                        global.disabled = false
                        if (!success) {
                            global.messageError = "Failed to store format to device"
                        } else {
                            global.messageSuccess = "Configuration has been saved to device"
                            saveConfigState()
                        }
                    })
                }
            })
        },
        sendFilesystemRequest(data, callback) {
            global.disabled = true
            logInfo("configStore.sendFilesystemRequest()", "Sending /api/filesystem")
            fetch(global.baseURL + 'api/filesystem', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.text())
                .then(text => {
                    logDebug("configStore.sendFilesystemRequest()", text)
                    callback(true, text)
                })
                .catch(err => {
                    logError("configStore.sendFilesystemRequest()", err)
                    callback(false, "")
                })
        },
        runPushTest(data, callback) {
            global.disabled = true
            this.sendPushTest(data, (success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getPushTestStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    if (!data.push_enabled) {
                                        global.messageWarning = "No endpoint is defined for this target. Cannot run test."
                                    } else if (!data.success) {
                                        global.messageError = "Test failed with error code " + getErrorString(data.last_error)
                                    } else {
                                        global.messageSuccess = "Test was successful"
                                    }

                                    callback(true)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get push test status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.messageError = "Failed to start push test"
                    global.disabled = false
                    callback(false)
                }
            })
        },
        runWifiScan(callback) {
            global.disabled = true
            this.sendWifiScan((success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getWifiScanStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    callback(data.success, data)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get wifi scan status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.disabled = false
                    global.messageError = "Failed to start wifi scan"
                    callback(false)
                }
            })
        },
    },
})