<template>
  <div class="container">
    <p></p>
    <p class="h3">Links and device logs</p>
    <hr />
    <div class="row">
      <p>
        If you need support, want to discuss the software or request any new features you can do
        that on github.com or homebrewtalk.com.
      </p>
    </div>
    <div class="row">
      <div class="col-md-4">
        <a
          class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          href="https://github.com/mp-se/gravitymon"
          target="_blank"
          >Report issues on github.com</a
        >
      </div>
      <div class="col-md-4">
        <a
          class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          href="https://www.homebrewtalk.com/"
          target="_blank"
          >Discuss on homebrewtalk.com</a
        >
      </div>
      <div class="col-md-4">
        <a
          class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          href="https://www.gravitymon.com/"
          target="_blank"
          >Read docs on gravitymon.com</a
        >
      </div>
    </div>

    <hr />
    <div class="row">
      <div class="col">
        <p>
          Platform: <span class="badge bg-secondary">{{ status.platform }}</span> Firmware:
          <span class="badge bg-secondary">{{ status.app_ver }} ({{ status.app_build }})</span> User
          interface:
          <span class="badge bg-secondary">{{ global.uiVersion }} ({{ global.uiBuild }})</span>
        </p>
      </div>
    </div>
    <hr />

    <div class="row">
      <div class="col-md-12">
        <button @click="viewLogs" type="button" class="btn btn-primary" :disabled="global.disabled">
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            :hidden="!global.disabled"
          ></span>
          &nbsp;View device logs</button
        >&nbsp;

        <button
          @click="removeLogs"
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
          &nbsp;Erase device logs
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <p></p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <pre>{{ logData }}</pre>
      </div>
      <div class="form-text">Starts with the latest log entry first.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { status, config, global } from '@/modules/pinia'
import { logDebug } from '@/modules/logger'

const logData = ref('')

function fetchLog(file, callback) {
  var data = {
    command: 'get',
    file: file
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      logDebug('SupportView.fetchLog()', 'Fetching ' + file + ' completed')
      var list = text.split('\n')
      list.forEach(function (item) {
        if (item.length) logData.value = item + '\n' + logData.value
      })
      callback(true)
    } else {
      callback(false)
    }
  })
}

function removeLog(file, callback) {
  var data = {
    command: 'del',
    file: file
  }

  config.sendFilesystemRequest(data, (success) => {
    callback(success)
  })
}

function viewLogs() {
  global.clearMessages()
  global.disabled = true
  logData.value = ''

  fetchLog('/error2.log', () => {
    fetchLog('/error.log', () => {
      global.disabled = false
    })
  })
}

function removeLogs() {
  global.clearMessages()
  global.disabled = true
  logData.value = ''

  removeLog('/error2.log', () => {
    removeLog('/error.log', () => {
      global.messageSuccess = 'Requested logs to be deleted'
      global.disabled = false
    })
  })
}
</script>
