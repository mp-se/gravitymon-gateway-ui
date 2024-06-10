import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { validateCurrentForm } from "@/modules/utils"
import * as badge from '@/modules/badge'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

import HomeView from '@/views/HomeView.vue'
import DeviceSettingsView from '@/views/DeviceSettingsView.vue'
import DeviceHardwareView from '@/views/DeviceHardwareView.vue'
import DeviceWifiView from '@/views/DeviceWifiView.vue'
import PushSettingsView from '@/views/PushSettingsView.vue'
import PushHttpPost1View from '@/views/PushHttpPost1View.vue'
import AboutView from '@/views/AboutView.vue'
import FirmwareView from '@/views/FirmwareView.vue'
import SupportView from '@/views/SupportView.vue'
import SerialView from '@/views/SerialView.vue'
import ToolsView from '@/views/ToolsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

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
    path: "/:catchAll(.*)",
    name: "404",
    component: NotFoundView
  }
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  if (global.disabled)
    return false

  if (!validateCurrentForm()) 
    return false;

  global.clearMessages()
  return true
})

const items = ref([
  {
    label: 'Home',
    icon: 'bi-home',
    path: '/',
    subs: []
  },
  {
    label: 'Device',
    icon: 'bi-cpu',
    path: '/device',
    badge: badge.deviceBadge,
    subs: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        badge: badge.deviceSettingBadge,
        path: '/device/settings',
      },
      {
        label: 'Hardware',
        icon: 'pi pi-cog',
        badge: badge.deviceHardwareBadge,
        path: '/device/hardware',
      },
      {
        label: 'Wifi',
        icon: 'pi pi-cog',
        badge: badge.deviceWifiBadge,
        path: '/device/wifi',
      },
    ]
  },
  {
    label: 'Push targets',
    icon: 'bi-cloud-up-arrow',
    path: '/push',
    badge: badge.pushBadge,
    subs: [
      {
        label: 'Settings',
        badge: badge.pushSettingBadge,
        path: '/push/settings',
      },
      {
        label: 'HTTP Post 1',
        badge: badge.pushHttpPost1Badge,
        path: '/push/http-post1',
      },
    ]
  },
  {
    label: 'Other',
    icon: 'bi-tools',
    path: '/other',
    subs: [
      {
        label: 'Serial console',
        path: '/other/serial',
      },
      {
        label: 'Firmware update',
        path: '/other/firmware',
      },
      {
        label: 'Support',
        path: '/other/support',
      },
      {
        label: 'Tools',
        path: '/other/tools',
      },
      {
        label: 'About',
        path: '/other/about',
      },
    ]
  },
])

export { items }