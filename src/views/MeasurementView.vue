<template>
  <div class="container">
    <p></p>
    <p class="h3">Measurements</p>
    <hr />

    <div class="row" v-if="!status.sd_mounted">
      <p>No SD card attached so this feature is not available.</p>
    </div>

    <div class="row" v-if="status.sd_mounted">
      <div class="col-md-12">
        <BsInputRadio
          v-model="deviceType"
          :options="deviceTypeOptions"
          label="Device Type"
          width=""
        ></BsInputRadio>
      </div>

      <div class="col-md-12">&nbsp;</div>

      <template v-if="deviceType === 0">
        <div class="col-md-12">
          <BsSelect
            v-model="gravitymonDevice"
            :options="gravitymonDeviceOptions"
            label="Device"
            width="5"
          ></BsSelect>
        </div>

        <div class="col-md-12">&nbsp;</div>

        <MeasurementTableFragment :data="filteredGravitymonData" :columns="gravitymonColumns" />
      </template>
      <template v-if="deviceType === 1">
        <div class="col-md-12">
          <BsSelect
            v-model="tiltDevice"
            :options="tiltDeviceOptions"
            label="Device"
            width="5"
          ></BsSelect>
        </div>

        <div class="col-md-12">&nbsp;</div>

        <MeasurementTableFragment :data="filteredTiltData" :columns="tiltColumns" />
      </template>
      <template v-if="deviceType === 2">
        <div class="col-md-12">
          <BsSelect
            v-model="pressuremonDevice"
            :options="pressuremonDeviceOptions"
            label="Device"
            width="5"
          ></BsSelect>
        </div>

        <div class="col-md-12">&nbsp;</div>

        <MeasurementTableFragment :data="filteredPressuremonData" :columns="pressuremonColumns" />
      </template>
      <template v-if="deviceType === 3">
        <div class="col-md-12">
          <BsSelect
            v-model="chamberControllerDevice"
            :options="chamberControllerDeviceOptions"
            label="Device"
            width="5"
          ></BsSelect>
        </div>

        <div class="col-md-12">&nbsp;</div>

        <MeasurementTableFragment
          :data="measurement.chamberControllerData"
          :columns="chamberControllerColumns"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { measurement, global, status } from '@/modules/pinia'
import { ref, watch, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { logDebug } from '@/modules/logger'
import BsSelect from '@/components/BsSelect.vue'
import BsInputRadio from '@/components/BsInputRadio.vue'
import MeasurementTableFragment from '@/fragments/MeasurementTableFragment.vue'

const deviceType = ref(-1)
const deviceTypeOptions = ref([
  //  { label: 'Text', value: 0 },
])

const gravitymonDevice = ref('')
const tiltDevice = ref('')
const pressuremonDevice = ref('')
const chamberControllerDevice = ref('')

const gravitymonDeviceOptions = ref([])
const tiltDeviceOptions = ref([])
const pressuremonDeviceOptions = ref([])
const chamberControllerDeviceOptions = ref([])

// Column definitions for each device type
const gravitymonColumns = ref([
  { key: 'id', label: 'ID', method: 'getId' },
  { key: 'name', label: 'Name', method: 'getName' },
  { key: 'token', label: 'Token', method: 'getToken' },
  { key: 'temp', label: 'Temp', method: 'getTempC', format: 'temperature' },
  { key: 'gravity', label: 'Gravity', method: 'getGravity' },
  { key: 'angle', label: 'Angle', method: 'getAngle' },
  { key: 'battery', label: 'Battery', method: 'getBattery', format: 'voltage' },
  { key: 'txPower', label: 'Tx Power', method: 'getTxPower' },
  { key: 'rssi', label: 'RSSI', method: 'getRssi' },
  { key: 'interval', label: 'Interval', method: 'getInterval', format: 'seconds' }
])

const tiltColumns = ref([
  // { key: 'id', label: 'ID', method: 'getId' },
  { key: 'color', label: 'Color', method: 'getColor' },
  { key: 'temp', label: 'Temp', method: 'getTempC', format: 'temperature' },
  { key: 'gravity', label: 'Gravity', method: 'getGravity' },
  { key: 'txPower', label: 'Tx Power', method: 'getTxPower' },
  { key: 'rssi', label: 'RSSI', method: 'getRssi' },
  { key: 'isPro', label: 'Is Pro', method: 'getIsPro', format: 'boolean' }
])

const pressuremonColumns = ref([
  { key: 'id', label: 'ID', method: 'getId' },
  { key: 'name', label: 'Name', method: 'getName' },
  { key: 'token', label: 'Token', method: 'getToken' },
  { key: 'temp', label: 'Temp', method: 'getTempC', format: 'temperature' },
  { key: 'pressure', label: 'Pressure', method: 'getPressure' },
  { key: 'pressure1', label: 'Pressure1', method: 'getPressure1' },
  { key: 'battery', label: 'Battery', method: 'getBattery', format: 'voltage' },
  { key: 'txPower', label: 'Tx Power', method: 'getTxPower' },
  { key: 'rssi', label: 'RSSI', method: 'getRssi' },
  { key: 'interval', label: 'Interval', method: 'getInterval', format: 'seconds' }
])

const chamberControllerColumns = ref([
  { key: 'id', label: 'ID', method: 'getId' },
  { key: 'chamberTemp', label: 'Chamber Temp', method: 'getChamberTempC', format: 'temperature' },
  { key: 'beerTemp', label: 'Beer Temp', method: 'getBeerTempC', format: 'temperature' },
  { key: 'rssi', label: 'RSSI', method: 'getRssi' }
])

onBeforeMount(() => {
  measurement.updateMeasurementFiles((success) => {
    if (success) {
      logDebug('MeasurementView.onBeforeMount()')

      measurement.fetchAllMeasurementFiles(() => {
        logDebug('MeasurementView.onBeforeMount()', 'callback')

        if (measurement.gravitymonData.length > 0) {
          deviceTypeOptions.value.push({ label: 'Gravitymon', value: 0 })

          const seenIds = new Set()
          gravitymonDeviceOptions.value = measurement.gravitymonData
            .filter((entry) => {
              if (seenIds.has(entry.getId())) return false
              seenIds.add(entry.getId())
              return true
            })
            .map((entry) => ({
              label: entry.getId() + ' - ' + entry.getName(),
              value: entry.getId()
            }))
          gravitymonDeviceOptions.value.push({ label: 'All devices', value: '' })
        }

        if (measurement.tiltData.length > 0) {
          deviceTypeOptions.value.push({ label: 'Tilt', value: 1 })

          const seenTiltIds = new Set()
          tiltDeviceOptions.value = measurement.tiltData
            .filter((entry) => {
              if (seenTiltIds.has(entry.getId())) return false
              seenTiltIds.add(entry.getId())
              return true
            })
            .map((entry) => ({
              label: entry.getId() + ' - ' + entry.getColor(),
              value: entry.getId()
            }))
          tiltDeviceOptions.value.push({ label: 'All devices', value: '' })
        }

        if (measurement.pressuremonData.length > 0) {
          deviceTypeOptions.value.push({ label: 'Pressuremon', value: 2 })

          const seenPressureIds = new Set()
          pressuremonDeviceOptions.value = measurement.pressuremonData
            .filter((entry) => {
              if (seenPressureIds.has(entry.getId())) return false
              seenPressureIds.add(entry.getId())
              return true
            })
            .map((entry) => ({
              label: entry.getId() + ' - ' + entry.getName(),
              value: entry.getId()
            }))
          pressuremonDeviceOptions.value.push({ label: 'All devices', value: '' })
        }

        if (measurement.chamberControllerData.length > 0) {
          deviceTypeOptions.value.push({ label: 'Chamber Controller', value: 3 })

          const seenChamberIds = new Set()
          chamberControllerDeviceOptions.value = measurement.chamberControllerData
            .filter((entry) => {
              if (seenChamberIds.has(entry.getId())) return false
              seenChamberIds.add(entry.getId())
              return true
            })
            .map((entry) => ({
              // label: entry.getId() + ' - ' + entry.getName(),
              label: entry.getId(),
              value: entry.getId()
            }))
          chamberControllerDeviceOptions.value.push({ label: 'All devices', value: '' })
        }
      })
    } else {
      global.errorMessage = 'Failed to fetch list of measurement files'
    }
  })
})

onBeforeUnmount(() => {})

// Watch for changes to deviceType
watch(deviceType, (newValue) => {
  logDebug('MeasurementView.watch()', 'Selected deviceType:', newValue)
})

const filteredGravitymonData = computed(() => {
  if (!gravitymonDevice.value) return measurement.gravitymonData
  return measurement.gravitymonData.filter((entry) => entry.getId() === gravitymonDevice.value)
})
const filteredTiltData = computed(() => {
  if (!tiltDevice.value) return measurement.tiltData
  return measurement.tiltData.filter((entry) => entry.getId() === tiltDevice.value)
})
const filteredPressuremonData = computed(() => {
  if (!pressuremonDevice.value) return measurement.pressuremonData
  return measurement.pressuremonData.filter((entry) => entry.getId() === pressuremonDevice.value)
})
</script>
