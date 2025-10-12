<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - MQTT</p>
    <hr />

    <form
      @submit.prevent="save"
      class="needs-validation"
      novalidate
      :disabled="config.use_wifi_direct"
    >
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.mqtt_target"
            maxlength="120"
            label="Server"
            help="Name of server to connect to, use format servername.com"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsInputNumber
            v-model="config.mqtt_port"
            label="Port"
            min="0"
            max="65535"
            help="Port number, 1883 is standard. Ports above 8000 means SSL"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_user"
            maxlength="20"
            label="User name"
            help="Username to use. Leave blank if authentication is disabled"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_pass"
            type="password"
            maxlength="20"
            label="Password"
            help="Password to use. Leave blank if authentication is disabled"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.mqtt_format_gravity"
            rows="6"
            label="Gravity Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.mqtt_gravity"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.mqtt_gravity"
            label="Enable gavity"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="gravityMqttFormatOptions"
            :callback="gravityMqttFormatCallback"
            :disabled="pushDisabled || !config.mqtt_gravity"
          />
          <BsModal
            @click="gravityRenderFormat"
            v-model="render"
            :code="true"
            :json="true"
            :mqtt="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.mqtt_gravity"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.mqtt_format_pressure"
            rows="6"
            label="Pressure Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.mqtt_pressure"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.mqtt_pressure"
            label="Enable pressure"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="pressureMqttFormatOptions"
            :callback="pressureMqttFormatCallback"
            :disabled="pushDisabled || !config.mqtt_pressure"
          />
          <BsModal
            @click="pressureRenderFormat"
            v-model="render"
            :code="true"
            :json="true"
            :mqtt="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.mqtt_pressure"
          />
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button
            @click="runTestGravity"
            type="button"
            class="btn btn-secondary"
            :disabled="pushDisabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push gravity test</button
          >&nbsp;
          <button
            @click="runTestPressure"
            type="button"
            class="btn btn-secondary"
            :disabled="pushDisabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push pressure test
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { applyTemplate, gravityMqttFormatOptions, pressureMqttFormatOptions } from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTestGravity = async () => {
  const data = { push_format: 'mqtt_format_gravity' }
  global.clearMessages()
  await config.runPushTest(data)
}

const runTestPressure = async () => {
  const data = { push_format: 'mqtt_format_pressure' }
  global.clearMessages()
  await config.runPushTest(data)
}

const gravityMqttFormatCallback = (opt) => {
  config.mqtt_format_gravity = decodeURIComponent(opt)
  config.mqtt_format_gravity = config.mqtt_format_gravity.replaceAll('|', '|\n')
}

const pressureMqttFormatCallback = (opt) => {
  config.mqtt_format_pressure = decodeURIComponent(opt)
  config.mqtt_format_pressure = config.mqtt_format_pressure.replaceAll('|', '|\n')
}

const gravityRenderFormat = () => {
  render.value = applyTemplate(status, config, config.mqtt_format_gravity)
}

const pressureRenderFormat = () => {
  render.value = applyTemplate(status, config, config.mqtt_format_pressure)
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
