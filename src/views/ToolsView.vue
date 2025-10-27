<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>

    <div class="col-md-12" v-if="status.sd_mounted">
      <BsInputRadio
        v-model="fileSystem"
        :options="fileSystemOptions"
        label="Select File System"
        width=""
      ></BsInputRadio>
    </div>
    <hr />

    <template v-if="fileSystem == 0">
      <ListFilesFragment type="fs"></ListFilesFragment>
      <div class="row gy-4">
        &nbsp;
        <hr />
      </div>
      <AdvancedFilesFragment v-if="!hideAdvanced" type="fs"></AdvancedFilesFragment>

      <div class="row gy-4" v-if="!hideAdvanced">
        &nbsp;
        <hr />
      </div>
    </template>

    <template v-else>
      <ListFilesFragment type="sd"></ListFilesFragment>
      <div class="row gy-4">
        &nbsp;
        <hr />
      </div>
      <AdvancedFilesFragment v-if="!hideAdvanced" type="sd"></AdvancedFilesFragment>

      <div class="row gy-4" v-if="!hideAdvanced">
        &nbsp;
        <hr />
      </div>
    </template>

    <div class="row gy-4" v-if="hideAdvanced">
      <div class="col-md-2">
        <button
          @click="enableAdvanced()"
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
          &nbsp;Enable Advanced
        </button>
      </div>
    </div>

    <EnableCorsFragment v-if="!hideAdvanced"></EnableCorsFragment>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global, status } from '@/modules/pinia'
import ListFilesFragment from '@/fragments/ListFilesFragment.vue'
import AdvancedFilesFragment from '@/fragments/AdvancedFilesFragment.vue'
import EnableCorsFragment from '@/fragments/EnableCorsFragment.vue'

const hideAdvanced = ref(true)
const fileSystem = ref(0)

const fileSystemOptions = ref([
  { label: 'Internal Flash', value: 0 },
  { label: 'Secure Digital (SD)', value: 1 }
])

function enableAdvanced() {
  hideAdvanced.value = !hideAdvanced.value
}
</script>
