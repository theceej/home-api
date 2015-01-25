var express = require('express');
var router = express.Router();

//var bodyParser = require('body-parser');
//var jsonParser = bodyParser.json();

var SerialPort = require("serialport").SerialPort
var usbSerial = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600
});



// Turn TV on
router.put('/power', function(req, res) {
  console.log(req.body);
  //  usbSerial.write("ka 01 01\n", function(err, results) {
  //    console.log('err ' + err);
  //    console.log('results ' + results);
  //  });
  res.send("Turned it on");
});

module.exports = router;
