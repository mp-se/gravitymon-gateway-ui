<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Post</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_target"
            type="url"
            maxlength="120"
            label="HTTP URL"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined URLs"
            button="URL"
            :options="httpPostUrlOptions"
            :callback="httpUrlCallback"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_header1"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #1"
            help=""
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH1Callback"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_header2"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #2"
            help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH2Callback"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_post_format"
            rows="6"
            label="Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="httpPostFormatOptions"
            :callback="httpFormatCallback"
            :disabled="global.disabled"
          />
          <BsModal
            @click="renderFormat"
            v-model="render"
            :code="true"
            title="Format preview"
            button="Preview format"
            :disabled="global.disabled"
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
            @click="runTest"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push test
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  validateCurrentForm,
  httpHeaderOptions,
  httpPostUrlOptions,
  httpPostFormatOptions,
  applyTemplate
} from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const runTest = () => {
  const data = {
    push_format: 'http_post_format'
  }

  global.clearMessages()
  config.runPushTest(data, () => {})
}

const httpUrlCallback = (opt) => {
  config.http_post_target = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_post_header1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_post_header2 = opt
}

const httpFormatCallback = (opt) => {
  config.http_post_format = decodeURIComponent(opt)
}

const renderFormat = () => {
  render.value = applyTemplate(status, config, config.http_post_format)
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
