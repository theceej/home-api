var express = require('express');
var router = express.Router();

//var bodyParser = require('body-parser');
//var jsonParser = bodyParser.json();

var SerialPort = require('serialport').SerialPort
var usbSerial = new SerialPort('/dev/ttyUSB0', {
  baudrate: 9600
});



// Turn TV on
router.put('/power', function(req, res) {
  if(typeof(req.body.on) === 'undefined') {
    res.status(400).json({ error : '"on" must be specified'})
  } else if(req.body.on) {
    usbSerial.write('ka 01 01\n', function(err, results) {
      if(err) {
        res.status(500).json({ error : 'Could not turn on TV: ' + err });
      } else {
        res.status(200).json({ on : true });
      }
    });
  } else {
    usbSerial.write('ka 01 00\n', function(err, results) {
      if(err) {
        res.status(500).json({ error : 'Could not turn off TV: ' + err });
      } else {
        res.status(200).json({ on : false });
      }
    });
  }
});

module.exports = router;
