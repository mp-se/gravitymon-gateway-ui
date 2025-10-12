import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import * as badge from '@/modules/badge'
import { global } from '@/modules/pinia'

import HomeView from '@/views/HomeView.vue'
import DeviceSettingsView from '@/views/DeviceSettingsView.vue'
import DeviceHardwareView from '@/views/DeviceHardwareView.vue'
import DeviceWifiView from '@/views/DeviceWifiView.vue'
import DeviceWifi2View from '@/views/DeviceWifi2View.vue'
import PushSettingsView from '@/views/PushSettingsView.vue'
import PushHttpPost1View from '@/views/PushHttpPost1View.vue'
import PushHttpPost2View from '@/views/PushHttpPost2View.vue'
import PushHttpGetView from '@/views/PushHttpGetView.vue'
import PushInfluxdbView from '@/views/PushInfluxdbView.vue'
import PushMqttView from '@/views/PushMqttView.vue'
import AboutView from '@/views/AboutView.vue'
import FirmwareView from '@/views/FirmwareView.vue'
import SupportView from '@/views/SupportView.vue'
import SerialView from '@/views/SerialView.vue'
import ToolsView from '@/views/ToolsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import MeasurementView from '@/views/MeasurementView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/device/settings',
    name: 'device-settings',
    component: DeviceSettingsView
  },
  {
    path: '/device/hardware',
    name: 'device-hardware',
    component: DeviceHardwareView
  },
  {
    path: '/device/wifi',
    name: 'device-wifi',
    component: DeviceWifiView
  },
  {
    path: '/device/wifi2',
    name: 'device-wifi2',
    component: DeviceWifi2View
  },
  {
    path: '/data',
    name: 'measurement',
    component: MeasurementView
  },
  {
    path: '/other/firmware',
    name: 'firmware',
    component: FirmwareView
  },
  {
    path: '/push/settings',
    name: 'push-settings',
    component: PushSettingsView
  },
  {
    path: '/push/http-post1',
    name: 'push-http-post1',
    component: PushHttpPost1View
  },
  {
    path: '/push/http-post2',
    name: 'push-http-post2',
    component: PushHttpPost2View
  },
  {
    path: '/push/http-get',
    name: 'push-http-get',
    component: PushHttpGetView
  },
  {
    path: '/push/influxdb',
    name: 'push-influxdb',
    component: PushInfluxdbView
  },
  {
    path: '/push/mqtt',
    name: 'push-Mqtt',
    component: PushMqttView
  },
  {
    path: '/other/support',
    name: 'support',
    component: SupportView
  },
  {
    path: '/other/tools',
    name: 'tools',
    component: ToolsView
  },
  {
    path: '/other/serial',
    name: 'serial',
    component: SerialView
  },
  {
    path: '/other/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

router.beforeEach(() => {
  if (global.disabled) return false

  if (!validateCurrentForm()) return false

  global.clearMessages()
  return true
})

const items = ref([
  {
    label: 'Home',
    icon: 'IconHome',
    path: '/',
    subs: []
  },
  {
    label: 'Device',
    icon: 'IconCpu',
    path: '/device',
    badge: badge.deviceBadge,
    subs: [
      {
        label: 'Settings',
        badge: badge.deviceSettingBadge,
        path: '/device/settings'
      },
      {
        label: 'Hardware',
        badge: badge.deviceHardwareBadge,
        path: '/device/hardware'
      },
      {
        label: 'Wifi',
        badge: badge.deviceWifiBadge,
        path: '/device/wifi'
      }
    ]
  },
  {
    label: 'Measurements',
    icon: 'IconData',
    path: '/data',
    subs: []
  },
  {
    label: 'Push targets',
    icon: 'IconCloudUpArrow',
    path: '/push',
    badge: badge.pushBadge,
    subs: [
      {
        label: 'Settings',
        badge: badge.pushSettingBadge,
        path: '/push/settings'
      },
      {
        label: 'HTTP Post',
        badge: badge.pushHttpPost1Badge,
        path: '/push/http-post1'
      },
      {
        label: 'HTTP Post 2',
        badge: badge.pushHttpPost2Badge,
        path: '/push/http-post2'
      },
      {
        label: 'HTTP Get',
        badge: badge.pushHttpGetBadge,
        path: '/push/http-get'
      },
      {
        label: 'Influxdb v2',
        badge: badge.pushHttpInfluxdb2Badge,
        path: '/push/influxdb'
      },
      {
        label: 'MQTT',
        badge: badge.pushHttpMqttBadge,
        path: '/push/mqtt'
      }
    ]
  },
  {
    label: 'Other',
    icon: 'IconTools',
    path: '/other',
    subs: [
      {
        label: 'Serial console',
        path: '/other/serial'
      },
      {
        label: 'Firmware update',
        path: '/other/firmware'
      },
      {
        label: 'Support',
        path: '/other/support'
      },
      {
        label: 'Tools',
        path: '/other/tools'
      },
      {
        label: 'About',
        path: '/other/about'
      }
    ]
  }
])

export { items }
