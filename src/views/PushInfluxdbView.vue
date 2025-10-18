<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - Influxdb v2</p>
    <hr />

    <form
      @submit.prevent="save"
      class="needs-validation"
      novalidate
      :disabled="config.use_wifi_direct"
    >
      <div class="row">
        <div class="col-md-12">
          <BsInputText
            v-model="config.influxdb2_target"
            type="url"
            maxlength="120"
            label="Server"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_org"
            maxlength="50"
            label="Organisation"
            help="Identifier to what organisation to use"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_bucket"
            maxlength="50"
            label="Bucket"
            help="Identifier for the data bucket to use"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_token"
            type="password"
            maxlength="100"
            label="Authentication token"
            help="Authentication token for accessing data bucket"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.influxdb2_format_gravity"
            rows="6"
            label="Gravity Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.influxdb2_gravity"
          />
        </div>
        <div class="col-md-3 gy-2">
          <BsInputSwitch
            v-model="config.influxdb2_gravity"
            label="Enable gravity"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="gravityInfluxdb2FormatOptions"
            :callback="gravityInfluxdb2FormatCallback"
            :disabled="pushDisabled || !config.influxdb2_gravity"
          />
          <BsModal
            @click="gravityRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.influxdb2_gravity"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.influxdb2_format_pressure"
            rows="6"
            label="Pressure Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.influxdb2_pressure"
          />
        </div>
        <div class="col-md-3 gy-2">
          <BsInputSwitch
            v-model="config.influxdb2_pressure"
            label="Enable pressure"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="pressureInfluxdb2FormatOptions"
            :callback="pressureInfluxdb2FormatCallback"
            :disabled="pushDisabled || !config.influxdb2_pressure"
          />
          <BsModal
            @click="pressureRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.influxdb2_pressure"
          />
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-sm-12">
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
import {
  applyTemplate,
  gravityInfluxdb2FormatOptions,
  pressureInfluxdb2FormatOptions
} from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTestGravity = async () => {
  const data = { push_format: 'influxdb2_format_gravity' }
  global.clearMessages()
  await config.runPushTest(data)
}

const runTestPressure = async () => {
  const data = { push_format: 'influxdb2_format_pressure' }
  global.clearMessages()
  await config.runPushTest(data)
}

const gravityInfluxdb2FormatCallback = (opt) => {
  config.influxdb2_format_gravity = decodeURIComponent(opt)
}

const pressureInfluxdb2FormatCallback = (opt) => {
  config.influxdb2_format_pressure = decodeURIComponent(opt)
}

const gravityRenderFormat = () => {
  render.value = applyTemplate(status, config, config.influxdb2_format_gravity)
}

const pressureRenderFormat = () => {
  render.value = applyTemplate(status, config, config.influxdb2_format_pressure)
}

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
