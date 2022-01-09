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
  
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  function connect() {
    //connect to sqms database
    connection.connect(function (err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
  
      console.log('connected as id ' + connection.threadId);
    });
  }