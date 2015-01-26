var express = require('express');
var router = express.Router();

var SerialPort = require('serialport').SerialPort
var usbSerial = new SerialPort('/dev/ttyUSB0', { 'baudrate' : 9600 });

// Turn TV on and off using serial port
router.put('/state', function(req, res) {
  if(req.body.on === true) {
    usbSerial.write('ka 01 01\n', function(err) {
      if(err) {
        res.status(500).json({ 'error' : { 'description' : 'Could not turn on TV: ' + err }});
      } else {
        res.status(200).json({ 'success' : { '/tv/state/on' : true }});
      }
    });
  } else if(req.body.on === false) {
    usbSerial.write('ka 01 00\n', function(err) {
      if(err) {
        res.status(500).json({ 'error' : { 'description' : 'Could not turn off TV: ' + err }});
      } else {
        res.status(200).json({ 'success' : { '/tv/state/on' : false }});
      }
    });
  } else {
    res.status(400).json({ 'error' : { 'description' : 'Invalid option specified' }});
  }
});

module.exports = router;
