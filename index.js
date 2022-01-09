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
          console.log(timestamp() + ' ' + 'device ' + deviceId + ' ' + endpoint + ' success: ' + JSON.stringify(results))
          res.status(200).send(results)
        }
        else {
          console.log(timestamp() + ' ' + 'device ' + deviceId + ' ' + endpoint + ' success: ' + JSON.stringify(results))
          res.status(200).send(results)
        }
      }
    })
  }

  catch{
    console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' error: ' + JSON.stringify(error))
    res.status(500).send(error)
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
        console.log(timestamp() + ' ' + 'device ' + deviceId + ' ' + endpoint + ' success: ' + JSON.stringify(results))
        res.status(200).send(results)
      }
    })
  }
  catch {
    console.log(timestamp() + ' ' + 'failed: device ' + deviceId + ' ' + endpoint + ' error: ' + JSON.stringify(error))
    res.status(500).send(error)
  }
})

app.listen(3000, function (req, res) {
  //start node server
  console.log('app running on port 3000')
})


//Analytics api
app.post('analytics/sleepdata', function (req, res) {
  var endpoint = 'analytics/sleepdata'
  var deviceId = req.body.id
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
      console.log(timestamp() + ' ' + 'device ' + deviceId + ' ' + endpoint + '  ' + results)
      res.status(200).send(results)
    }
  })
})

function timestamp() {
  var today = new Date()
  var time = today.toLocaleString()
  return time
}