var express = require('express');
var router = express.Router();

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600
});

// Turn TV on
router.put('/on', function(req, res, next) {
  serialPort.on("open", function () {
    console.log('open');
    serialPort.write("ka 01 01\n", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  });
  res.send("Turned it on");
});

module.exports = router;
