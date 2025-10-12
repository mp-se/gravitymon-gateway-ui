import { ref } from 'vue'
import { global } from '@/modules/pinia'
import { logError } from '@mp-se/espframework-ui-components'
import {
  tempToF,
  tempToC,
  psiToBar,
  psiToKPa,
  barToPsi,
  kpaToPsi
} from '@mp-se/espframework-ui-components'

export const httpHeaderOptions = ref([
  { label: 'JSON data', value: 'Content-Type: application/json' },
  { label: 'Form data', value: 'Content-Type: x-www-form-urlencoded' },
  { label: 'Authorization', value: 'Authorization: Basic {enter token here}' },
  { label: 'No Cache', value: 'Pragma: no-cache' },
  { label: 'User agent', value: 'User-Agent: gravitymon-gateway' }
])

export const httpPostUrlOptions = ref([
  { label: 'Brewfather ispindel', value: 'http://log.brewfather.net/ispindel?id=<yourid>' },
  { label: 'Brewfather stream', value: 'http://log.brewfather.net/stream?id=<yourid>' },
  {
    label: 'UBI dots',
    value: 'http://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  {
    label: 'UBI dots secure',
    value: 'https://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  { label: 'Brewersfriend (P)', value: 'http://log.brewersfriend.com/ispindel/[API KEY]' },
  { label: 'Brewersfriend (SG)', value: 'http://log.brewersfriend.com/ispindel_sg/[API KEY]' },
  { label: 'Brewspy', value: 'http://brew-spy.com/api/ispindel' },
  { label: 'Thingsspeak', value: 'http://api.thingspeak.com/update.json' },
  { label: 'Blynk', value: 'http://blynk.cloud/external/api/batch/update' },
  { label: 'Bierdot bricks', value: 'https://brewbricks.com/api/iot/v1' }
])

export const httpGetUrlOptions = ref([{ label: '-blank-', value: '' }])

export const gravityHttpPostFormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      '%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%2C%20%22corr-gravity%22%3A%20%24%7Bcorr-gravity%7D%2C%20%22gravity-unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%7D'
  },
  {
    label: 'iSpindle',
    value:
      '%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D'
  },
  {
    label: 'BrewFatherCustom',
    value:
      '%7B%20%20%20%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%20%20%22temp%22%3A%20%24%7Btemp%7D%2C%20%20%20%22aux_temp%22%3A%200%2C%20%20%20%22ext_temp%22%3A%200%2C%20%20%20%22temp_unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22gravity_unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%20%20%22pressure%22%3A%200%2C%20%20%20%22pressure_unit%22%3A%20%22PSI%22%2C%20%20%20%22ph%22%3A%200%2C%20%20%20%22bpm%22%3A%200%2C%20%20%20%22comment%22%3A%20%22%22%2C%20%20%20%22beer%22%3A%20%22%22%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%7D'
  },
  {
    label: 'UBIDots',
    value:
      '%7B%20%20%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%20%20%22rssi%22%3A%20%24%7Brssi%7D%7D'
  }
])

export const gravityHttpGetFormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temp-units%3D%24%7Btemp-unit%7D%26gravity%3D%24%7Bgravity%7D%26angle%3D%24%7Bangle%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26corr-gravity%3D%24%7Bcorr-gravity%7D%26gravity-unit%3D%24%7Bgravity-unit%7D%26run-time%3D%24%7Brun-time%7D'
  }
])

export const gravityInfluxdb2FormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  }
])

export const gravityMqttFormatOptions = ref([
  {
    label: 'iSpindle',
    value:
      'ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp_units%3A%24%7Btemp-unit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'HomeAssistant',
    value:
      'gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7C'
  },
  {
    label: 'HomeAssistant 2',
    value:
      'gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftemperature%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_temp%22%2C%22name%22%3A%22temperature%22%2C%22dev_cla%22%3A%22temperature%22%2C%22unit_of_meas%22%3A%22%C2%B0%24%7Btemp-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftemperature%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fgravity%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_grav%22%2C%22name%22%3A%22gravity%22%2C%22unit_of_meas%22%3A%22%20%24%7Bgravity-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fgravity%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Frssi%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_rssi%22%2C%22name%22%3A%22rssi%22%2C%22dev_cla%22%3A%22signal_strength%22%2C%22unit_of_meas%22%3A%22dBm%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Frssi%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftilt%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_tilt%22%2C%22name%22%3A%22tilt%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftilt%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fbattery%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_batt%22%2C%22name%22%3A%22battery%22%2C%22dev_cla%22%3A%22voltage%22%2C%22unit_of_meas%22%3A%22V%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fbattery%22%7D%7C'
  },
  {
    label: 'Brewblox',
    value:
      'brewcast%2Fhistory%3A%7B%22key%22%3A%22%24%7Bmdns%7D%22%2C%22data%22%3A%7B%22Temperature%5BdegC%5D%22%3A%20%24%7Btemp-c%7D%2C%22Temperature%5BdegF%5D%22%3A%20%24%7Btemp-f%7D%2C%22Battery%5BV%5D%22%3A%24%7Bbattery%7D%2C%22Tilt%5Bdeg%5D%22%3A%24%7Bangle%7D%2C%22Rssi%5BdBm%5D%22%3A%24%7Brssi%7D%2C%22SG%22%3A%24%7Bgravity-sg%7D%2C%22Plato%22%3A%24%7Bgravity-plato%7D%7D%7D%7C'
  },
  {
    label: 'PressureMon',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature%2Dunit%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure%2Dunit%22%3A%20%22%24%7Bpressure%2Dunit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D'
  }
])

export const pressureHttpPostFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature%2Dunit%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure%2Dunit%22%3A%20%22%24%7Bpressure%2Dunit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature-unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%20%7D'
  }
])

export const pressureHttpGetFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep%2Dinterval%7D%26temperature%3D%24%7Btemp%7D%26temperature%2Dunit%3D%24%7Btemp%2Dunit%7D%26pressure%3D%24%7Bpressure%7D%26pressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run%2Dtime%3D%24%7Brun%2Dtime%7D'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temperature-unit%3D%24%7Btemp-unit%7D%26pressure%3D%24%7Bpressure%7D%26pressure1%3D%24%7Bpressure1%7D%26pressure-unit%3D%24%7Bpressure-unit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run-time%3D%24%7Brun-time%7D'
  }
])

export const pressureInfluxdb2FormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature%2Dunit%3D%24%7Btemp%2Dunit%7D%2Cpressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%20pressure%3D%24%7Bpressure%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature-unit%3D%24%7Btemp-unit%7D%2Cpressure-unit%3D%24%7Bpressure-unit%7D%20pressure%3D%24%7Bpressure%7D%2Cpressure1%3D%24%7Bpressure1%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  }
])

export const pressureMqttFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      'pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature%2Dunit%3A%24%7Btemp%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%2Dunit%3A%24%7Bpressure%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      'pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature-unit%3A%24%7Btemp-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure1%3A%24%7Bpressure1%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure-unit%3A%24%7Bpressure-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'Brewblox (Single)',
    value:
      'brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C'
  },
  {
    label: 'Brewblox (Dual)',
    value:
      'brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C'
  }
])

export function applyTemplate(status, config, template) {
  var s = template

  s = s.replaceAll('${temp}', status.temp)

  var c = status.temp
  var f = status.temp

  if (config.temp_unit === 'C') {
    f = tempToF(status.temp)
  } else {
    c = tempToC(status.temp)
  }

  // TODO: Adjust the template values that are needed

  s = s.replaceAll('${temp-c}', c)
  s = s.replaceAll('${temp-f}', f)
  s = s.replaceAll('${angle}', status.angle)
  s = s.replaceAll('${tilt}', status.angle)
  s = s.replaceAll('${app-ver}', global.app_ver)
  s = s.replaceAll('${app-build}', global.app_build)
  s = s.replaceAll('${rssi}', status.rssi)
  s = s.replaceAll('${battery}', status.battery)

  if (config.gravity_unit === 'G') {
    var sg = status.gravity
    s = s.replaceAll('${gravity}', sg)
    s = s.replaceAll('${gravity-sg}', sg)
    s = s.replaceAll('${corr-gravity}', sg)
    s = s.replaceAll('${corr-gravity-sg}', sg)
    var plato = 259 - (259 - sg)
    s = s.replaceAll('${gravity-plato}', plato)
    s = s.replaceAll('${corr-gravity-plato}', sg)
  } else {
    plato = status.gravity
    s = s.replaceAll('${gravity}', plato)
    s = s.replaceAll('${corr-gravity}', plato)
    s = s.replaceAll('${corr-gravity-plato}', plato)
    s = s.replaceAll('${gravity-plato}', plato)
    sg = 259 / (259 - plato)
    s = s.replaceAll('${corr-gravity-sg}', plato)
    s = s.replaceAll('${gravity-sg}', sg)
  }

  s = s.replaceAll('${velocity}', 1.01)

  s = s.replaceAll('${mdns}', config.mdns)
  s = s.replaceAll('${id}', config.id)
  s = s.replaceAll('${sleep-interval}', config.sleep_interval)
  s = s.replaceAll('${token}', config.token)
  s = s.replaceAll('${temp-unit}', config.temp_unit)
  s = s.replaceAll('${gravity-unit}', config.gravity_unit)

  s = s.replaceAll('${run-time}', 1)

  var p = status.pressure

  if (status.isKPa) {
    p = kpaToPsi(p)
  } else if (status.isBar) {
    p = barToPsi(p)
  }

  s = s.replaceAll('${pressure}', p)
  s = s.replaceAll('${pressure-psi}', p)
  s = s.replaceAll('${pressure-bar}', psiToBar(p))
  s = s.replaceAll('${pressure-kpa}', psiToKPa(p))

  s = s.replaceAll('${pressure1}', p)
  s = s.replaceAll('${pressure1-psi}', p)
  s = s.replaceAll('${pressure1-bar}', psiToBar(p))
  s = s.replaceAll('${pressure1-kpa}', psiToKPa(p))

  s = s.replaceAll('${app-ver}', global.app_ver)
  s = s.replaceAll('${app-build}', global.app_build)
  s = s.replaceAll('${battery-percent}', 100)
  s = s.replaceAll('${rssi}', status.rssi)
  s = s.replaceAll('${run-time}', status.runtime_average)
  s = s.replaceAll('${corr-gravity}', status.gravity)
  s = s.replaceAll('${battery}', status.battery)

  s = s.replaceAll('${mdns}', config.mdns)
  s = s.replaceAll('${id}', config.id)
  s = s.replaceAll('${sleep-interval}', config.sleep_interval)
  s = s.replaceAll('${token}', config.token)
  s = s.replaceAll('${token2}', config.token2)
  s = s.replaceAll('${temp-unit}', config.temp_unit)
  s = s.replaceAll('${pressure-unit}', config.pressure_unit)

  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch {
    logError('utils.applyTemplate()', 'Not a valid json document, returning string')
  }

  return s
}
