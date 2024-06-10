<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">

      <div class="row gy-4">  

        <div class="col-md-4">
          <BsCard header="Measurement" title="WIFI">
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { global, status } from "@/modules/pinia"
</script>

<style></style>