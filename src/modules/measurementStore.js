import { defineStore } from 'pinia'
import { global, config } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'
import { tempToF, psiToBar, psiToKPa, gravityToPlato } from '@/modules/utils'

// TODO: Convert to SG->Plato and C->F if needed

class TiltData {
  constructor({ type, source, created, id, color, tempC, gravitySG, txPower, rssi }) {
    this.type = type
    this.source = source
    this.created = new Date(created)
    this.id = id
    this.color = color
    this.temp = config.temp_unit == 'C' ? tempC : tempToF(tempC)
    this.gravity = config.gravity_unit == 'SG' ? gravitySG : gravityToPlato(gravitySG)
    this.txPower = txPower
    this.rssi = rssi
    this.isPro = type === 'Tilt Pro'
  }

  getType() {
    return this.type
  }
  getSource() {
    return this.source
  }
  getCreated() {
    return this.created
  }
  getId() {
    return this.id
  }
  getColor() {
    return this.color
  }
  getTemp() {
    return this.temp
  }
  getGravity() {
    return this.gravity
  }
  getTxPower() {
    return this.txPower
  }
  getRssi() {
    return this.rssi
  }
  getIsPro() {
    return this.isPro
  }

  static isTiltDataCsv(line) {
    const parts = line.split(',')
    return parts.length >= 2 && parts[0] === '1' && (parts[1] === 'Tilt' || parts[1] === 'Tilt Pro')
  }

  // Example: 1,Tilt,BLE Beacon,2025-07-06 12:34:56,Red,Red,20.00,1.0500,-59,-70,,,,
  // Example: 1,Tilt Pro,BLE Beacon,2025-07-06 12:34:56,Red,Red,20.00,1.0500,-59,-70,,,,
  static fromCsvLine(line) {
    const parts = line.split(',')
    if (parts.length < 10) {
      logError('TiltData.fromCsvLine', 'Invalid TiltData CSV line', line)
      return
    }
    if (parts[0] !== '1') {
      logError('TiltData.fromCsvLine', 'Unsupported TiltData CSV version:', parts[0], line)
      return
    }
    if (parts[1] !== 'Tilt' && parts[1] !== 'Tilt Pro') {
      logError('TiltData.fromCsvLine', 'CSV line is not for TiltData:', parts[1], line)
      return
    }
    return new TiltData({
      type: parts[1],
      source: parts[2],
      created: parts[3], // Will be parsed to Date in constructor
      id: parts[4],
      color: parts[5],
      tempC: parseFloat(parts[6]),
      gravitySG: parseFloat(parts[7]),
      txPower: parseInt(parts[8], 10),
      rssi: parseInt(parts[9], 10)
    })
  }
}

class PressureData {
  constructor({
    type,
    source,
    created,
    id,
    name,
    token,
    tempC,
    pressurePsi,
    pressurePsi1,
    battery,
    txPower,
    rssi,
    interval
  }) {
    this.type = type
    this.source = source
    this.created = new Date(created)
    this.id = id
    this.name = name
    this.token = token
    this.temp = tempC
    this.temp = config.temp_unit == 'C' ? tempC : tempToF(tempC)
    this.pressure =
      config.pressure_unit == 'PSI'
        ? pressurePsi
        : config.pressure_unit == 'Bar'
          ? psiToBar(pressurePsi)
          : psiToKPa(pressurePsi)
    this.pressure1 =
      config.pressure_unit == 'PSI'
        ? pressurePsi1
        : config.pressure_unit == 'Bar'
          ? psiToBar(pressurePsi1)
          : psiToKPa(pressurePsi1)
    this.battery = battery
    this.txPower = txPower
    this.rssi = rssi
    this.interval = interval
  }

  getType() {
    return this.type
  }
  getSource() {
    return this.source
  }
  getCreated() {
    return this.created
  }
  getId() {
    return this.id
  }
  getName() {
    return this.name
  }
  getToken() {
    return this.token
  }
  getTemp() {
    return this.temp
  }
  getPressure() {
    return this.pressure
  }
  getPressure1() {
    return this.pressure1
  }
  getBattery() {
    return this.battery
  }
  getTxPower() {
    return this.txPower
  }
  getRssi() {
    return this.rssi
  }
  getInterval() {
    return this.interval
  }

  static isPressureDataCsv(line) {
    const parts = line.split(',')
    return parts.length >= 2 && parts[0] === '1' && parts[1] === 'Pressuremon'
  }

  // Example: 1,Pressuremon,BLE Beacon,2025-07-06 12:34:56,ID,Name,Token,20.00,1.0000,1.0000,3.70,-59,-70,60
  static fromCsvLine(line) {
    const parts = line.split(',')
    if (parts.length < 14) {
      logError('PressureData.fromCsvLine', 'Invalid PressureData CSV line', line)
      return
    }
    if (parts[0] !== '1') {
      logError('PressureData.fromCsvLine', 'Unsupported PressureData CSV version:', parts[0], line)
      return
    }
    if (parts[1] !== 'Pressuremon') {
      logError('PressureData.fromCsvLine', 'CSV line is not for PressureData:', parts[1], line)
      return
    }
    return new PressureData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      name: parts[5],
      token: parts[6],
      tempC: parseFloat(parts[7]),
      pressurePsi: parseFloat(parts[8]),
      pressurePsi1: parseFloat(parts[9]),
      battery: parseFloat(parts[10]),
      txPower: parseInt(parts[11], 10),
      rssi: parseInt(parts[12], 10),
      interval: parseInt(parts[13], 10)
    })
  }
}

class GravityData {
  constructor({
    type,
    source,
    created,
    id,
    name,
    token,
    tempC,
    gravitySG,
    angle,
    battery,
    txPower,
    rssi,
    interval
  }) {
    this.type = type
    this.source = source
    this.created = new Date(created)
    this.id = id
    this.name = name
    this.token = token
    this.temp = config.temp_unit == 'C' ? tempC : tempToF(tempC)
    this.gravity = config.gravity_unit == 'SG' ? gravitySG : gravityToPlato(gravitySG)
    this.angle = angle
    this.battery = battery
    this.txPower = txPower
    this.rssi = rssi
    this.interval = interval
  }

  getType() {
    return this.type
  }
  getSource() {
    return this.source
  }
  getCreated() {
    return this.created
  }
  getId() {
    return this.id
  }
  getName() {
    return this.name
  }
  getToken() {
    return this.token
  }
  getTemp() {
    return this.temp
  }
  getGravity() {
    return this.gravity
  }
  getAngle() {
    return this.angle
  }
  getBattery() {
    return this.battery
  }
  getTxPower() {
    return this.txPower
  }
  getRssi() {
    return this.rssi
  }
  getInterval() {
    return this.interval
  }

  static isGravityDataCsv(line) {
    const parts = line.split(',')
    return parts.length >= 2 && parts[0] === '1' && parts[1] === 'Gravitymon'
  }

  // Example: 1,Gravitymon,BLE Beacon,2025-07-06 12:34:56,ID,Name,Token,20.00,1.0500,45.00,3.70,-59,-70,60
  static fromCsvLine(line) {
    const parts = line.split(',')
    if (parts.length < 14) {
      logError('GravityData.fromCsvLine', 'Invalid GravityData CSV line', line)
      return
    }
    if (parts[0] !== '1') {
      logError('GravityData.fromCsvLine', 'Unsupported GravityData CSV version:', parts[0], line)
      return
    }
    if (parts[1] !== 'Gravitymon') {
      logError('GravityData.fromCsvLine', 'CSV line is not for GravityData:', parts[1], line)
      return
    }
    return new GravityData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      name: parts[5],
      token: parts[6],
      tempC: parseFloat(parts[7]),
      gravitySG: parseFloat(parts[8]),
      angle: parseFloat(parts[9]),
      battery: parseFloat(parts[10]),
      txPower: parseInt(parts[11], 10),
      rssi: parseInt(parts[12], 10),
      interval: parseInt(parts[13], 10)
    })
  }
}

class RaptData {
  constructor({ type, source, created, id, tempC, gravitySG, angle, battery, txPower, rssi }) {
    this.type = type
    this.source = source
    this.created = new Date(created)
    this.id = id
    this.temp = config.temp_unit == 'C' ? tempC : tempToF(tempC)
    this.gravity = config.gravity_unit == 'SG' ? gravitySG : gravityToPlato(gravitySG)
    this.angle = angle
    this.battery = battery
    this.txPower = txPower
    this.rssi = rssi
  }

  getType() {
    return this.type
  }
  getSource() {
    return this.source
  }
  getCreated() {
    return this.created
  }
  getId() {
    return this.id
  }
  getTemp() {
    return this.temp
  }
  getGravity() {
    return this.gravity
  }
  getAngle() {
    return this.angle
  }
  getBattery() {
    return this.battery
  }
  getTxPower() {
    return this.txPower
  }
  getRssi() {
    return this.rssi
  }

  static isRaptDataCsv(line) {
    const parts = line.split(',')
    return parts.length >= 2 && parts[0] === '1' && parts[1] === 'RAPT'
  }

  // Example: 1,RAPT,BLE Beacon,2025-08-13 08:04:40,EEE222,15.20,1.0300,35.3300,3.84,10,-72,,,
  static fromCsvLine(line) {
    const parts = line.split(',')
    if (parts.length < 14) {
      logError('RaptData.fromCsvLine', 'Invalid RaptData CSV line', line)
      return
    }
    if (parts[0] !== '1') {
      logError('RaptData.fromCsvLine', 'Unsupported RaptData CSV version:', parts[0], line)
      return
    }
    if (parts[1] !== 'RAPT') {
      logError('RaptData.fromCsvLine', 'CSV line is not for RaptData:', parts[1], line)
      return
    }
    return new RaptData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      tempC: parseFloat(parts[5]),
      gravitySG: parseFloat(parts[6]),
      angle: parseFloat(parts[7]),
      battery: parseFloat(parts[8]),
      txPower: parseInt(parts[9], 10),
      rssi: parseInt(parts[10], 10)
    })
  }
}

class ChamberData {
  constructor({ type, source, created, id, chamberTempC, beerTempC, rssi }) {
    this.type = type
    this.source = source
    this.created = new Date(created)
    this.id = id
    this.chamberTemp = config.temp_unit == 'C' ? chamberTempC : tempToF(chamberTempC)
    this.beerTemp = config.temp_unit == 'C' ? beerTempC : tempToF(beerTempC)
    this.rssi = rssi
  }

  getType() {
    return this.type
  }
  getSource() {
    return this.source
  }
  getCreated() {
    return this.created
  }
  getId() {
    return this.id
  }
  getChamberTemp() {
    return this.chamberTemp
  }
  getBeerTemp() {
    return this.beerTemp
  }
  getRssi() {
    return this.rssi
  }

  static isChamberDataCsv(line) {
    const parts = line.split(',')
    return parts.length >= 2 && parts[0] === '1' && parts[1] === 'Chamber Controller'
  }

  // Example: 1,Chamber Controller,BLE Beacon,2025-07-06 12:34:56,ID,20.00,19.00,-70,,,,,,
  static fromCsvLine(line) {
    const parts = line.split(',')
    if (parts.length < 8) {
      logError('ChamberData.fromCsvLine', 'Invalid ChamberData CSV line', line)
      return
    }
    if (parts[0] !== '1') {
      logError('ChamberData.fromCsvLine', 'Unsupported ChamberData CSV version:', parts[0], line)
      return
    }
    if (parts[1] !== 'Chamber Controller') {
      logError('ChamberData.fromCsvLine', 'CSV line is not for ChamberData:', parts[1], line)
      return
    }
    return new ChamberData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      chamberTempC: parseFloat(parts[5]),
      beerTempC: parseFloat(parts[6]),
      rssi: parseInt(parts[7], 10)
    })
  }
}

export const useMeasurementStore = defineStore('measurement', {
  state: () => {
    return {
      files: [],
      gravitymonData: [],
      pressuremonData: [],
      tiltData: [],
      chamberData: [],
      raptData: []
    }
  },
  getters: {},
  actions: {
    async fetchAllMeasurementFiles(callback) {
      if (!this.files || this.files.length === 0) return
      const fetchFile = (file) =>
        new Promise((resolve) => {
          this.fetchSecureDiskFile(file, (success, text) => {
            resolve(success && text ? text : '')
          })
        })
      const fileContents = await Promise.all(this.files.map(fetchFile))
      const allLines = fileContents
        .map((content) => content.split(/\r?\n/).filter((line) => line.trim().length > 0))
        .flat()

      logInfo('measurementStore.fetchAllMeasurementFiles()', allLines)

      this.tiltData = []
      this.gravitymonData = []
      this.pressuremonData = []
      this.chamberData = []
      this.raptData = []

      for (const line of allLines) {
        if (!line.trim()) continue
        if (TiltData.isTiltDataCsv(line)) {
          const obj = TiltData.fromCsvLine(line)
          if (obj) this.tiltData.push(obj)
        } else if (GravityData.isGravityDataCsv(line)) {
          const obj = GravityData.fromCsvLine(line)
          if (obj) this.gravitymonData.push(obj)
        } else if (PressureData.isPressureDataCsv(line)) {
          const obj = PressureData.fromCsvLine(line)
          if (obj) this.pressuremonData.push(obj)
        } else if (ChamberData.isChamberDataCsv(line)) {
          const obj = ChamberData.fromCsvLine(line)
          if (obj) this.chamberData.push(obj)
        } else if (RaptData.isRaptDataCsv(line)) {
          const obj = RaptData.fromCsvLine(line)
          if (obj) this.raptData.push(obj)
        } else {
          logError('parseMeasurementFileLines', 'Unknown CSV line type', line)
        }
      }

      // Sort each data set by created (ascending)
      const getTime = (entry) =>
        entry.getCreated() instanceof Date
          ? entry.getCreated().getTime()
          : new Date(entry.getCreated()).getTime()
      this.gravitymonData.sort((a, b) => getTime(a) - getTime(b))
      this.pressuremonData.sort((a, b) => getTime(a) - getTime(b))
      this.tiltData.sort((a, b) => getTime(a) - getTime(b))
      this.chamberData.sort((a, b) => getTime(a) - getTime(b))
      this.raptData.sort((a, b) => getTime(a) - getTime(b))

      callback()
    },
    updateMeasurementFiles(callback) {
      logInfo('measurementStore.updateMeasurementFiles()', 'Updating measurement files')

      var data = {
        command: 'dir'
      }

      this.files = []

      this.sendSecureDiskRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text)
          logInfo('measurementStore.updateMeasurementFiles()', json)

          for (const f of json.files) {
            if (f.file.endsWith('.csv') && f.file.startsWith('/data')) this.files.push(f.file)
          }

          logInfo('measurementStore.updateMeasurementFiles()', this.files)
          callback(true)
        } else {
          logError('measurementStore.updateMeasurementFiles()', 'Failed to fetch measurement files')
          callback(false)
        }
      })
    },
    sendSecureDiskRequest(data, callback) {
      global.disabled = true
      logInfo('dataStore.sendSecureDiskRequest()', 'Sending /api/sd')
      fetch(global.baseURL + 'api/sd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: global.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.text())
        .then((text) => {
          logDebug('dataStore.sendSecureDiskRequest()', text)
          global.disabled = false
          callback(true, text)
        })
        .catch((err) => {
          logError('dataStore.sendSecureDiskRequest()', err)
          global.disabled = false
          callback(false, '')
        })
    },
    fetchSecureDiskFile(fileName, callback) {
      global.disabled = true
      logInfo('dataStore.fetchSecureDiskFile()', 'Fetching file from /sd')
      fetch(global.baseURL + 'sd' + fileName, {
        method: 'GET',
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.text())
        .then((text) => {
          logDebug('dataStore.fetchSecureDiskFile()', text)
          global.disabled = false
          callback(true, text)
        })
        .catch((err) => {
          logError('dataStore.fetchSecureDiskFile()', err)
          global.disabled = false
          callback(false, '')
        })
    }
  }
})
