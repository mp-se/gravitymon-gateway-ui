<template>
    <div class="container">
        <p></p>
        <p class="h3">Device - Hardware</p>
        <hr>

        <form @submit.prevent="save" class="needs-validation" novalidate>
            <div class="row">

                <div class="col-md-12">
                    <hr>
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
import { ref, computed } from 'vue'
import { validateCurrentForm, restart } from "@/modules/utils"
import { global, config, status } from "@/modules/pinia"
import * as badge from '@/modules/badge'
import { logDebug, logError, logInfo } from '@/modules/logger'

const save = () => {
    if (!validateCurrentForm()) return

    global.clearMessages()
    config.saveAll()
}
</script>
