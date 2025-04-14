<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Post #2</p>
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
            v-model="config.http_post2_target"
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
            :options="httpPostUrlOptions"
            :callback="httpUrlCallback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post2_header1"
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
            v-model="config.http_post2_header2"
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
      </div>
      <div class="row">
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_post2_format_gravity"
            rows="6"
            label="Gravity Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.http_post_gravity"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.http_post2_gravity"
            label="Enable gravity"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="gravityHttpPostFormatOptions"
            :callback="gravityHttpFormatCallback"
            :disabled="pushDisabled || !config.http_post2_gravity"
          />
          <BsModal
            @click="gravityRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.http_post2_gravity"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_post2_format_pressure"
            rows="6"
            label="Pressure Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled || !config.http_post2_pressure"
          />
        </div>
        <div class="col-md-3">
          <BsInputSwitch
            v-model="config.http_post2_pressure"
            label="Enable pressure"
            :disabled="global.disabled"
          />
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="pressureHttpPostFormatOptions"
            :callback="pressureHttpFormatCallback"
            :disabled="pushDisabled || !config.http_post2_pressure"
          />
          <BsModal
            @click="pressureRenderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled || !config.http_post2_pressure"
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

          <!-- <button @click="runTestGravity" type="button" class="btn btn-secondary" :disabled="pushDisabled">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push gravity test
          </button>&nbsp;
          <button @click="runTestPressure" type="button" class="btn btn-secondary" :disabled="pushDisabled">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push pressure test
          </button> -->
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  validateCurrentForm,
  httpHeaderOptions,
  httpPostUrlOptions,
  gravityHttpPostFormatOptions,
  pressureHttpPostFormatOptions,
  applyTemplate
} from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTestGravity = () => {
  const data = {
    push_format: 'http_post2',
    target: 'gravity'
  }

  global.clearMessages()
  config.runPushTest(data, () => {})
}

const runTestPressure = () => {
  const data = {
    push_format: 'http_post2',
    target: 'pressure'
  }

  global.clearMessages()
  config.runPushTest(data, () => {})
}

const httpUrlCallback = (opt) => {
  config.http_post2_target = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_post2_header1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_post2_header2 = opt
}

const gravityHttpFormatCallback = (opt) => {
  config.http_post2_format_gravity = decodeURIComponent(opt)
}

const pressureHttpFormatCallback = (opt) => {
  config.http_post2_format_pressure = decodeURIComponent(opt)
}

const gravityRenderFormat = () => {
  render.value = applyTemplate(status, config, config.http_post2_format_gravity)
}

const pressureRenderFormat = () => {
  render.value = applyTemplate(status, config, config.http_post2_format_pressure)
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
