<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Get</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_target"
            type="url"
            maxlength="120"
            label="HTTP URL"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined URLs"
            button="URL"
            :options="httpGetUrlOptions"
            :callback="httpUrlCallback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header1"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #1"
            help=""
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH1Callback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header2"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #2"
            help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH2Callback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_get_format_gravity"
            rows="6"
            label="Gravity Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.http_get_gravity"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.http_get_gravity"
            label="Enable gravity"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="gravityHttpGetFormatOptions"
            :callback="gravityHttpFormatCallback"
            :disabled="pushDisabled || !config.http_get_gravity"
          />
          <BsModal
            @click="gravityRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.http_get_gravity"
          />
        </div>

        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_get_format_pressure"
            rows="6"
            label="Pressure Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.http_get_pressure"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.http_get_pressure"
            label="Enable pressure"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="pressureHttpGetFormatOptions"
            :callback="pressureHttpFormatCallback"
            :disabled="pushDisabled || !config.http_get_pressure"
          />
          <BsModal
            @click="pressureRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.http_get_pressure"
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
import {
  httpGetUrlOptions,
  applyTemplate,
  httpHeaderOptions,
  gravityHttpGetFormatOptions,
  pressureHttpGetFormatOptions
} from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTestGravity = async () => {
  const data = { push_format: 'http_get_format_gravity' }
  global.clearMessages()
  await config.runPushTest(data)
}

const runTestPressure = async () => {
  const data = { push_format: 'http_get_format_pressure' }
  global.clearMessages()
  await config.runPushTest(data)
}

const httpUrlCallback = (opt) => {
  config.http_get_target = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_get_header1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_get_header2 = opt
}

const gravityHttpFormatCallback = (opt) => {
  config.http_get_format_gravity = decodeURIComponent(opt)
}

const pressureHttpFormatCallback = (opt) => {
  config.http_get_format_pressure = decodeURIComponent(opt)
}

const gravityRenderFormat = () => {
  var s = applyTemplate(status, config, config.http_get_format_gravity)
  render.value = s.replaceAll('&', '&')
}

const pressureRenderFormat = () => {
  var s = applyTemplate(status, config, config.http_get_format_pressure)
  render.value = s.replaceAll('&', '&')
}

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
