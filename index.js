const express = require('express')
const app = express()
var mysql = require('mysql');
const { timeout } = require('nodemon/lib/config');
const { watchOptions } = require('nodemon/lib/config/defaults');
var cors = require('cors')

app.use(cors())



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sqms'
});

var activated = false
var paired = false

app.get('/pair', function (req, res) {
  if (paired) {
    res.send('Device already paired')
  }
  else {
    var query = "SELECT * FROM pets where device_code = ?"
    var deviceCode = '1234'

    connection.query({
      sql: query,
      timeout: 40000, // 40s
      values: deviceCode
    }, function (error, results, fields) {

      if (error) {
        console.log(error)
        console.log('device pair unsuccessful')
        res.send('pairing not successful. System error')
        throw error
      }

      else {
        console.log(results)

        if (results.length === 0) {
          console.log('device pair unsuccessful. Device not assigned to pet')
          res.send('pairing not successful')
        }
        else {
          paired = true
          console.log('device pair successful')
          res.send('pairing successful')
        }
      }
    })
  }
})

app.get('/activate', function (req, res) {
  if (paired) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    activated = true
    console.log('Transmission status|time|date|temperature|heart_rate|oxygen_saturation|snoring_detection|accelerometer_data|pets_device_code\n');
    res.send('Device Activated at: ' + date + ' ' + time)
  }
  else {
    console.log('Device not paired');
    res.send('Device not paired. Pair device before activating');
  }
})

app.get('/deactivate', function (req, res) {
  if (activated) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    activated = false
    res.send('Device deactivated at: ' + date + ' ' + time)
  }
  else {
    console.log('Device not active.');
    res.send('Device is not activate. Can only deactivate an active device');
  }
})

app.get('/transmit', function (req, res) {

  if (activated) {
    for (i = 0; i < 20; i++) {
      transmitData()
      sleep(1000)
    }
    res.send('data sent')
  }

  else {
    console.log('transmission not successful')
    res.send('data not send. Device not active')
  }

})



app.listen(3000, function (req, res) {
  //start node server
  console.log('app running on port 3000')

  //connect to sqms database
  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);
  });
})

app.get('/test', function (req, res) {
  var i
  for (i = 0; i < 10; i++) {
    var value = randomInt(0, 100)
    console.log(value)
  }
})

function generateData(deviceCode) {

  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  var id = '';
  var temperature = randomInt(0, 100);
  var heartRate = randomInt(0, 100);
  var oxygenSaturation = randomInt(0, 100);
  var snoringDetection = randomBool();
  var accelerometerData = randomInt(0, 100);

  var randomData = [id, time, date, temperature, heartRate, oxygenSaturation, snoringDetection, accelerometerData, deviceCode]
  console.log(heartRate);
  console.log(randomData);
  return randomData
}

function randomFloat(min, max) {
  var random = Math.random() * (max - min) + min;
  return random.toFixed(2)
}

function randomInt(min, max) {
  var random = Math.floor(Math.random() * (max - min + 1) + min);
  return random
}

function randomBool(min, max) {
  var random = randomInt(min, max)
  if (random === 1) {
    return 'yes'
  }
  else {
    return 'no'
  }
}

function sleep(ms) {
  console.log('delay')
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hello(){
  console.log('hello')
}

function transmitData() {
  var query
  var wearableData

  query = "INSERT INTO `sleep_metrics`(`id`, `time`, `date`, `temperature`, `heart_rate`, `oxygen_saturation`, `snoring_detection`, `accelerometer_data`, `pets_device_code`) VALUES (?,?,?,?,?,?,?,?,?)"
  wearableData = generateData(1234)

  connection.query({
    sql: query,
    timeout: 40000, // 40s
    values: wearableData
  }, function (error, results, fields) {
    if (error) {
      console.log('unsuccessful ' + error)
      res.send('transmission not successful. System error')
      throw error
    }

    else {
      //console.log(results);
      console.log('successful Device ' + wearableData[8] + wearableData);
      //res.send('data sent')
    }
  })
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

app.get('/sleepdata', function(req, res){
  var deviceId = req.query.id
  query = "SELECT * from sleep_metrics where pets_device_code = ?"
  wearableData = generateData(1234)

  connection.query({
    sql: query,
    timeout: 40000, // 40s
    values: deviceId
  }, function (error, results, fields) {
    if (error) {
      console.log('unsuccessful ' + error)
      res.send('transmission not successful. System error')
      throw error
    }

    else {
      //console.log(results);
      console.log(results)
      res.send(results)
      //res.send('data sent')
    }
  })
})