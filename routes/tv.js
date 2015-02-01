var express = require('express');
var router = express.Router();

var SerialPort = require('serialport').SerialPort
var usbSerial = new SerialPort('/dev/ttyUSB0', { 'baudrate' : 9600 });

// Need to store some state
var currentOn = false;

// Turn TV on and off using serial port
router.put('/state', function(req, res) {
  if(req.body.on === true) {
    usbSerial.write('ka 01 01\n', function(err) {
      if(err) {
        res.status(500).json([{ 'error' : { 'description' : 'Could not turn on TV: ' + err }}]);
      } else {
        currentOn = true;
        res.status(200).json([{ 'success' : { '/tv/state/on' : currentOn }}]);
      }
    });
  } else if(req.body.on === false) {
    usbSerial.write('ka 01 00\n', function(err) {
      if(err) {
        res.status(500).json([{ 'error' : { 'description' : 'Could not turn off TV: ' + err }}]);
      } else {
        currentOn = false;
        res.status(200).json([{ 'success' : { '/tv/state/on' : currentOn }}]);
      }
    });
  } else {
    res.status(400).json([{ 'error' : { 'description' : 'Invalid option specified' }}]);
  }
});

router.get ('/', function(req, res) {
  res.status(200).json({ 'state' : { 'on' : currentOn }});
});

module.exports = router;
