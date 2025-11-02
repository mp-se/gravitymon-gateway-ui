<template>
  <div class="container">
    <p></p>
    <p class="h2">Measurement - Settings</p>
    <hr />

    <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.sd_log_files"
            unit=""
            label="Number of sd card log files"
            min="2"
            max="100"
            step="1"
            width="5"
            help="Max number of log files to keep on the SD card, each file is 16kb in size"
            :disabled="global.disabled"
          ></BsInputNumber>
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
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'

const saveSettings = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
