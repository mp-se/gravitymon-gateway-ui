<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">

      <div class="row gy-4">

        <template v-for="g in status.gravity_device" :key="g.device">
          <div class="col-md-4">
            <BsCard header="Gravity Device" color="info" :title="g.device + ' (' + formatTime(g.update_time) + ' / ' + formatTime(g.push_time) + ')'">
              <p class="text-center">
                Gravity: {{ formatGravity(g.gravity) }} {{ config.gravity_format === 'G' ? ' SG' : ' P' }} Temperature: {{ formatTemp(g.temp) }} {{ config.temp_format }}
              </p>
            </BsCard>
          </div>
        </template>

        <div class="col-md-4">
          <BsCard header="Device" title="WIFI">
            <p class="text-center">
              {{ status.rssi }} dBm - {{ status.wifi_ssid }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Adress">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Software version">
            <p class="text-center">
              Firmware: {{ status.app_ver }} ({{ status.app_build }}) UI: {{ global.uiVersion }} ({{ global.uiBuild }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">
              {{ status.platform }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Uptime">
            <p class="text-center">
              {{ status.uptime_days }} days {{ status.uptime_hours }} hours {{ status.uptime_minutes }} minutes {{ status.uptime_seconds }} seconds
            </p>
          </BsCard>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { global, status, config } from "@/modules/pinia"
import { logDebug } from "@/modules/logger";
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'

const polling = ref(null)

function formatTime(t) {
  if(t<60) // less than 1 min
    return new Number(t).toFixed(0) + "s"

  if(t<(60*60)) // less than 1 hour
    return new Number(t/60).toFixed(0) + "m"

  if(t<(60*60*24)) // less than 1 day
    return new Number(t/(60*60)).toFixed(0) + "h"

  return new Number(t/(60*60*24)).toFixed(0) + "d"
}

function formatGravity(g) {
  return config.gravity_format === "G" ? new Number(g).toFixed(3) : new Number(g).toFixed(1)
}

function formatTemp(t) {
  return config.temp_format === "C" ? new Number(t).toFixed(2) : new Number(t).toFixed(1)
}

function refresh() {
  status.load((success) => {
  })
}

onBeforeMount(() => {
  refresh();
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})
</script>

<style></style>