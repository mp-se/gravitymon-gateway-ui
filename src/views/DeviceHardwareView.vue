<template>
    <div class="container">
        <p></p>
        <p class="h3">Device - Hardware</p>
        <hr>

        <form @submit.prevent="save" class="needs-validation" novalidate>
            <div class="row">

                <div class="col-md-6">
                    <BsInputRadio v-model="config.ble_active_scan" :options="bleScanOptions" label="BLE Scanning"
                        width="" :disabled="global.disabled"></BsInputRadio>
                </div>

                <div class="col-md-12">
                    <p></p>
                    <p>Supporting the following GravityMon BLE transmission options:
                        <li>GravityMon iBeacon</li>
                        <li>GravityMon Service</li>
                        <li>GravityMon EddyStone (Require Active Mode)</li>
                    </p>

                    <p>If you want to use the Tilt transmission options I recommend TiltBridge!</p>
                </div>

            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <hr>
                </div>
                <div class="col-md-3">
                    <button type="submit" class="btn btn-primary w-2"
                        :disabled="global.disabled || !global.configChanged">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            :hidden="!global.disabled"></span>
                        &nbsp;Save
                    </button>
                </div>
                <div class="col-md-3">
                    <button @click="restart()" type="button" class="btn btn-secondary" :disabled="global.disabled">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            :hidden="!global.disabled"></span>
                        &nbsp;Restart device
                    </button>
                </div>

            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateCurrentForm, restart } from "@/modules/utils"
import { global, config } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

const bleScanOptions = ref([
    { label: 'Active', value: true },
    { label: 'Passive', value: false },
])

const save = () => {
    if (!validateCurrentForm()) return

    global.clearMessages()
    config.saveAll()
}
</script>
