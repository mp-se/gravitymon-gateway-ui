<template>
  <div class="container">
    <p></p>
    <p class="h3">Measurements</p>
    <hr />

    <div class="row" v-if="!status.sd_enabled">
      <p>No SD card attached so this feature is not available.</p>
    </div>

    <div class="row" v-if="status.sd_enabled">
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

        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Created</th>
                <th>ID</th>
                <th>Name</th>
                <th>Token</th>
                <th>Temp</th>
                <th>Gravity</th>
                <th>Angle</th>
                <th>Battery</th>
                <th>Tx Power</th>
                <th>RSSI</th>
                <th>Interval</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in filteredGravitymonData" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  {{
                    entry.getCreated() instanceof Date
                      ? `${entry.getCreated().getFullYear()}-${String(entry.getCreated().getMonth() + 1).padStart(2, '0')}-${String(entry.getCreated().getDate()).padStart(2, '0')} ${String(entry.getCreated().getHours()).padStart(2, '0')}:${String(entry.getCreated().getMinutes()).padStart(2, '0')}`
                      : entry.getCreated()
                  }}
                </td>
                <td>{{ entry.getId() }}</td>
                <td>{{ entry.getName() }}</td>
                <td>{{ entry.getToken() }}</td>
                <td>{{ entry.getTempC() }}°C</td>
                <td>{{ entry.getGravity() }}</td>
                <td>{{ entry.getAngle() }}</td>
                <td>{{ entry.getBattery() }}V</td>
                <td>{{ entry.getTxPower() }}</td>
                <td>{{ entry.getRssi() }}</td>
                <td>{{ entry.getInterval() }}s</td>
              </tr>
            </tbody>
          </table>
        </div>
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

        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Created</th>
                <th>ID</th>
                <th>Color</th>
                <th>Temp</th>
                <th>Gravity</th>
                <th>Tx Power</th>
                <th>RSSI</th>
                <th>Is Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in filteredTiltData" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  {{
                    entry.getCreated() instanceof Date
                      ? `${entry.getCreated().getFullYear()}-${String(entry.getCreated().getMonth() + 1).padStart(2, '0')}-${String(entry.getCreated().getDate()).padStart(2, '0')} ${String(entry.getCreated().getHours()).padStart(2, '0')}:${String(entry.getCreated().getMinutes()).padStart(2, '0')}`
                      : entry.getCreated()
                  }}
                </td>
                <td>{{ entry.getId() }}</td>
                <td>{{ entry.getColor() }}</td>
                <td>{{ entry.getTempC() }}°C</td>
                <td>{{ entry.getGravity() }}</td>
                <td>{{ entry.getTxPower() }}</td>
                <td>{{ entry.getRssi() }}</td>
                <td>{{ entry.getIsPro() ? 'Yes' : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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

        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Created</th>
                <th>ID</th>
                <th>Name</th>
                <th>Token</th>
                <th>Temp</th>
                <th>Pressure</th>
                <th>Pressure1</th>
                <th>Battery</th>
                <th>Tx Power</th>
                <th>RSSI</th>
                <th>Interval</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in filteredPressuremonData" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  {{
                    entry.getCreated() instanceof Date
                      ? `${entry.getCreated().getFullYear()}-${String(entry.getCreated().getMonth() + 1).padStart(2, '0')}-${String(entry.getCreated().getDate()).padStart(2, '0')} ${String(entry.getCreated().getHours()).padStart(2, '0')}:${String(entry.getCreated().getMinutes()).padStart(2, '0')}`
                      : entry.getCreated()
                  }}
                </td>
                <td>{{ entry.getId() }}</td>
                <td>{{ entry.getName() }}</td>
                <td>{{ entry.getToken() }}</td>
                <td>{{ entry.getTempC() }}°C</td>
                <td>{{ entry.getPressure() }}</td>
                <td>{{ entry.getPressure1() }}</td>
                <td>{{ entry.getBattery() }}V</td>
                <td>{{ entry.getTxPower() }}</td>
                <td>{{ entry.getRssi() }}</td>
                <td>{{ entry.getInterval() }}s</td>
              </tr>
            </tbody>
          </table>
        </div>
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

        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Created</th>
                <th>ID</th>
                <th>Chamber Temp</th>
                <th>Beer Temp</th>
                <th>RSSI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, idx) in measurement.chamberControllerData" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  {{
                    entry.getCreated() instanceof Date
                      ? `${entry.getCreated().getFullYear()}-${String(entry.getCreated().getMonth() + 1).padStart(2, '0')}-${String(entry.getCreated().getDate()).padStart(2, '0')} ${String(entry.getCreated().getHours()).padStart(2, '0')}:${String(entry.getCreated().getMinutes()).padStart(2, '0')}`
                      : entry.getCreated()
                  }}
                </td>
                <td>{{ entry.getId() }}</td>
                <td>{{ entry.getChamberTempC() }}°C</td>
                <td>{{ entry.getBeerTempC() }}°C</td>
                <td>{{ entry.getRssi() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { measurement, global, status } from '@/modules/pinia'
import { ref, watch, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { logDebug } from '@/modules/logger'
import BsDropdown from '@/components/BsDropdown.vue'
import BsSelect from '@/components/BsSelect.vue'

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
              label: entry.getId() + ' - ' + entry.getName(),
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
watch(deviceType, (newValue, oldValue) => {
  logDebug('MeasurementView.watch()', 'Selected deviceType:', newValue)


})

const filteredGravitymonData = computed(() => {
  if (!gravitymonDevice.value) return measurement.gravitymonData
  return measurement.gravitymonData.filter(entry => entry.getId() === gravitymonDevice.value)
})
const filteredTiltData = computed(() => {
  if (!tiltDevice.value) return measurement.tiltData
  return measurement.tiltData.filter(entry => entry.getId() === tiltDevice.value)
})
const filteredPressuremonData = computed(() => {
  if (!pressuremonDevice.value) return measurement.pressuremonData
  return measurement.pressuremonData.filter(entry => entry.getId() === pressuremonDevice.value)
})
</script>
