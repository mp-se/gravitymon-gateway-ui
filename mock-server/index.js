const express = require('express')
var cors = require('cors')

const multer  = require('multer');
const upload = multer({ dest: "./" });

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/api/firmware', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

configData = {
  // Device configuration
  id: "7376ef",
  mdns: "gravmon3",
  temp_format: "C",
  gravity_format: "G",
  dark_mode: false, 
  // Hardware
  ble_active_scan: false,
  ble_scan_time: 5,
  timezone: "CET-1CEST,M3.5.0,M10.5.0/3",
  // Wifi
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push - Generic
  token: "mytoken",
  push_timeout: 10,
  push_resend_time: 300, 
  // Push - Http Post 1–
  http_post_target: "http://192.168.1.10:9090/api/v1/ZYfjlUNeiuyu9N/telemetry",
  http_post_header1: "Auth: Basic T7IF9DD9fF3RDddE=",
  http_post_header2: "Auth: Advanced T7IF9DD9fF3RDddE=",
}

formatData = {
  http_post_format: "%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D",
}

statusData = {
  id: "7376ef",
  angle: 22.4,
  rssi: -56,
  app_ver: "2.0.0",
  app_build: "gitrev",
  mdns: "gravmon",
  platform: "esp32",
  wifi_ssid: "wifi",
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  wifi_setup: false,
  gravity_device: [ 
    { device: "dev1", gravity: 1.100, temp: 24},  
    { device: "dev2", gravity: 1.100, temp: 24},
    { device: "dev3", gravity: 1.100, temp: 24},  
    { device: "dev4", gravity: 1.100, temp: 24},  
    { device: "dev5", gravity: 1.100, temp: 24},  
  ]
}

app.get('/api/auth', (req, res) => {
  console.log('GET: /api/auth')
  /* 
   * Description:    Perform device authentication and receive access token
   * Authentication: No
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  data = { token: statusData.id }

  console.log(req.headers['authorization'])
  res.send(data)
})

app.get('/api/config', (req, res) => {
  console.log('GET: /api/config')
  /* 
   * Description:    Return configuration data as json document. 
   * Authentication: Required
   * Limitation:     Don't include format templates due to their size.
   *                 Wifi passwords are removed due to security considerations (no encrypted transfer).
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(configData)
})

app.get('/api/restart', (req, res) => {
  console.log('GET: /api/restart')
  /* 
   * Description:    Perform a restart of the device
   * Authentication: Required
   * Limitation:     - 
   * Note:           Simulator will wait 2 seconds before returning result.
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      status: true,
      success: true,
      message: "Device is restarting..."
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

var testRunning = false

app.post('/api/push', (req, res) => {
  console.log('GET: /api/push')
  /* 
   * Description:    Initiate the push test for a defined target
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/test/push/status to check for completion
   * Return:         200 OK, 401 Access Denied, 422 Content Invalid
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  if(!req.body.hasOwnProperty("push_format")) {
    res.sendStatus(422)
    return
  }  
  testRunning = true
  setTimeout(() => { testRunning = false }, 5000)
  var data = {
    success: true,
    message: "Test scheduled."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/push/status', (req, res) => {
  console.log('GET: /api/push/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (testRunning) {
    data = {
      status: testRunning,
      success: false,
      message: "Push test running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Push test completed...",
      push_return_code: 200,
      push_enabled: true
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/factory', (req, res) => {
  console.log('GET: /api/factory')
  /* 
   * Description:    Simualate a factory reset.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Factory settings restored"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/format', (req, res) => {
  console.log('GET: /api/format')
  /* 
   * Description:    Return format data as json document. 
   * Authentication: Required
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(formatData)
})

app.get('/api/status', (req, res) => {
  console.log('GET: /api/status')
  /* 
   * Description:    Return status data as json document. 
   * Authentication: None
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(statusData)
})

app.post('/api/config', (req, res) => {
  console.log('POST: /api/config')
  /* 
   * Description:    Update the configuration data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See config read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    configData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Configuration stored",
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/format', (req, res) => {
  console.log('POST: /api/format')
  /* 
   * Description:    Update the format data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See format read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    formatData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Format stored",
  }
  res.type('application/json')
  res.send(data)
})

var wifiScanRunning = false

app.get('/api/wifi', (req, res) => {
  console.log('GET: /api/wifi')
  /* 
   * Description:    Do a wifi scan for avaialble networks
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/wifi/scan/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  wifiScanRunning = true
  setTimeout(() => { wifiScanRunning = false }, 8000)
  var data = {
    success: true,
    message: "Wifi scan started."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/wifi/status', (req, res) => {
  console.log('GET: /api/wifi/status')
  /* 
   * Description:    Return status of the current wifi scan process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (wifiScanRunning) {
    data = {
      status: wifiScanRunning,
      success: false,
      message: "Wifi scan running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Wifi scan completed...",
      networks: [ 
        { wifi_ssid: "network A", rssi: -20, channel: 10, encryption: 2 }, 
        { wifi_ssid: "network B", rssi: -70, channel: 12, encryption: 3 }, 
        { wifi_ssid: "network C", rssi: -50, channel: 6, encryption: 0 }
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/filesystem', (req, res) => {
  console.log('POST: /api/filesystem')
  /* 
   * Description:    Interact with local file system on the device
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied, 400 Faulty request
   * Request body:
     {
       command: "dir|get|del",
       file: "name of file for get and del"
     }
   */
  console.log("Command:", req.body.command)
  
  if(req.body.command == "dir") {
    var data = { 
      total: 1000,
      used: 900,
      free: 100,
      files: [
        { file: "/error.log", size: 10 },
        { file: "/error2.log", size: 10 },
        { file: "/config.json", size: 10 },
        { file: "/gravitymon.json", size: 10 },
      ]
    }
    res.type('application/json')
    res.send(data)
    return
  }
  else if(req.body.command == "del") {
    console.log(req.body.file)
    setTimeout(() => {
      res.sendStatus(200)
    }, 2000)
    return
  } else if(req.body.command == "get") {
    console.log(req.body.file)
    if(req.body.file == "/error.log") {
      setTimeout(() => {
        res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
      }, 1000)
    } else if(req.body.file == "/error2.log") {
      setTimeout(() => {
        res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
      }, 1000)
    } else  if(req.body.file == "/gravitygw.json"){
      var gravmon = {
        "mdns": "gravitygw18798",
        "id": "e18798",
        "ota-url": "http://ota",
        "wifi-ssid": "@home",
        "wifi-pass": "",
        "wifi-ssid2": "",
        "wifi-pass2": "",
        "ble": "pink",
        "temp-format": "C",
        "token": "token",
        "token2": "token2",
        "http-push": "http://push1",
        "http-push-h1": "Content-Type: application/json1",
        "http-push-h2": "c: d",
        "http-push2": "http://push2",
        "http-push2-h1": "Content-Type: application/json2",
        "http-push2-h2": "a: b",
        "http-push3": "http://push3",
        "influxdb2-push": "push4",
        "influxdb2-org": "org",
        "influxdb2-bucket": "bucket",
        "influxdb2-auth": "auth",
        "mqtt-push": "push5",
        "mqtt-port": 1883,
        "mqtt-user": "user",
        "mqtt-pass": "pass",
        "sleep-interval": 900,
        "voltage-factor": 0.59,
        "voltage-config": 4.15,
        "gravity-formula": "tilt*2+til*3+1.0334",
        "gravity-format": "G",
        "temp-adjustment-value": 0,
        "gravity-temp-adjustment": false,
        "gyro-temp": false,
        "storage-sleep": false,
        "gravitymon-ble": false,
        "gyro-calibration-data": {
            "ax": 0,
            "ay": 1,
            "az": 2,
            "gx": 3,
            "gy": 4,
            "gz": 5
        },
        "formula-calculation-data": {
            "a1": 1,
            "a2": 2,
            "a3": 3,
            "a4": 4,
            "a5": 5,
            "a6": 6,
            "a7": 7,
            "a8": 8,
            "a9": 9,
            "a10": 10,
            "g1": 1.01,
            "g2": 1.02,
            "g3": 1.03,
            "g4": 1.04,
            "g5": 1.05,
            "g6": 1.06,
            "g7": 1.07,
            "g8": 1.08,
            "g9": 1.09,
            "g10": 1.10
        },
        "app-ver": "1.4.0",
        "app-build": "beta-2",
        "angle": 89.943,
        "gravity": 0,
        "battery": 1.95,
        "runtime-average": 0,
        "platform": "esp32s3"
      }
      res.send(gravmon)
    }
    return
  } 

  res.sendStatus(400)
})

app.listen(port, () => {
  console.log(`Gravitymon BLE Gateway API simulator port ${port}`)
})