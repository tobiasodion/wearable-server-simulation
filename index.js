const express = require('express')
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { timeout } = require('nodemon/lib/config');
const { watchOptions } = require('nodemon/lib/config/defaults');
const { request } = require('express');
const res = require('express/lib/response');
const Connection = require('mysql/lib/Connection');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sqms'
});

app.post('/pair', function (req, res) {
  var endpoint = '/pair'
  var query = "SELECT * FROM pets where device_code = ?"
  var deviceId = req.body.id

  try {
    connection.query({
      sql: query,
      timeout: 40000, // 40s
      values: deviceId
    }, function (error, results, fields) {
      if (error) {
        throw error
      }
  
      else {
        if (results.length === 0) {
          console.log(timestamp() + ' ' + 'success: device ' + deviceId + ' ' + endpoint + ' ' + JSON.stringify(results))
          res.send('01')
        }
        else {
          console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' ' + JSON.stringify(results))
          res.send('00')
        }
      }
    })
  }

  catch{
    console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' error: ' + JSON.stringify(error))
    res.send('11')
  }
})

app.post('/transmit', function (req, res) {
  var endpoint = '/transmit'
  wearableData = req.body.data

  var query = "INSERT INTO `sleep_metrics`(`id`, `time`, `date`, `temperature`, `heart_rate`, `oxygen_saturation`, `snoring_detection`, `accelerometer_data`, `pets_device_code`) VALUES (?,?,?,?,?,?,?,?,?)"
  try {
    connection.query({
      sql: query,
      timeout: 40000, // 40s
      values: wearableData
    }, function (error, results, fields) {
      if (error) {
        throw error
      }

      else {
        console.log(timestamp() + ' ' + 'success: device ' + deviceId + ' ' + endpoint + ' ' + JSON.stringify(results))
        res.send(results)
      }
    })
  }
  catch {
    console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' error: ' + JSON.stringify(error))
    res.status(500).send(error)
  }
})

//Analytics api
/*app.get('/analytics/sleepdata', function (req, res) {
  var endpoint = 'analytics/sleepdata'
  //var deviceId = req.body.id
  var deviceId = req.query.id
  query = "SELECT * from sleep_metrics where pets_device_code = ?"
  //wearableData = generateData(1234)

  connection.query({
    sql: query,
    timeout: 40000, // 40s
    values: deviceId
  }, function (error, results, fields) {
    if (error) {
      console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + '  ' + JSON.stringify(error) + ' ' + JSON.stringify(results))
      res.status(500).send(error)
      throw error
    }

    else {
      console.log(timestamp() + ' ' + 'success: device ' + deviceId + ' ' + endpoint + '  ' + results)
      res.status(200).send(results)
    }
  })
})*/

app.get('/analytics/sleepdata', function (req, res) {
  console.log(req)
  var endpoint = 'analytics/sleepdata'
  //var deviceId = req.body.id
  var deviceId = req.query.id
  var startDate = req.query.fromdate
  var endDate = req.query.todate
  var startTime = req.query.fromtime
  var endTime = req.query.totime

  query = "SELECT * from sleep_metrics where pets_device_code = ? AND date BETWEEN ? AND ?"
  //wearableData = generateData(1234)

  connection.query({
    sql: query,
    timeout: 40000, // 40s
    values: [deviceId, startDate, endDate]
  }, function (error, results, fields) {
    if (error) {
      console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' ' + JSON.stringify(error) + ' ' + JSON.stringify(results))
      res.status(500).send(error)
      throw error
    }

    else {
      console.log(timestamp() + ' ' + 'success: device ' + deviceId + ' ' + endpoint + ' ' + results)
      res.status(200).send(results)
    }
  })
})

app.listen(3000, function (req, res) {
  //start node server
  console.log('app running on port 3000')
})

function timestamp() {
  var today = new Date()
  var time = today.toLocaleString()
  return time
}