var express = require('express');
var router = express.Router();
var async = require('async');
var lirc = require('lirc_node');
lirc.init();

// Need to store some state
var currentVol = -82;
var currentOn = false;
var currentSource = 'unknown';
var currentMute = false;

router.put('/state', function(req, res) {
  async.series([
    // Turn amp on and off using lirc
    function(callback) {
      if('on' in req.body) {
        if(req.body.on) {
          lirc.irsend.send_once("amp", "powerOn", function() {
            currentVol = -82;
            currentOn = true;
            currentMute = false;
            callback(null, { 'success' : { 'amp/state/on' : currentOn }});
          });
        } else {
          lirc.irsend.send_once("amp", "powerOff", function() {
            currentOn = false;
            callback(null, { 'success' : { 'amp/state/on' : currentOn }});
          });
        }
      } else {
        callback();
      }
    },
    // Change the amp source
    function(callback) {
      if('source' in req.body) {
        switch(req.body.source)
        {
          case 'chromecast':
            lirc.irsend.send_once("amp", "vcrDvr", function() {
              currentSource = 'chromecast';
              callback(null, { 'success' : { 'amp/state/source' : currentSource }});
            });
            break;
          case 'ps3':
            lirc.irsend.send_once("amp", "game", function() {
              currentSource = 'ps3';
              callback(null, { 'success' : { 'amp/state/source' : currentSource }});
            });
            break;
          case 'pi':
            lirc.irsend.send_once("amp", "cd", function() {
              currentSource = 'pi';
              callback(null, { 'success' : { 'amp/state/source' : currentSource }});
            });
            break;
          case 'aux':
            lirc.irsend.send_once("amp", "aux", function() {
              currentSource = 'aux';
              callback(null, { 'success' : { 'amp/state/source' : currentSource }});
            });
            break;
          case 'radio':
            lirc.irsend.send_once("amp", "tuner", function() {
              currentSource = 'radio';
              callback(null, { 'success' : { 'amp/state/source' : currentSource }});
            });
            break;
          default:
            callback(null, { 'error' : { 'description' : 'Invalid source specified, valid options are "chromecase", "ps3", "pi", "aux" or "radio"'}});
            break;
        }
      } else {
        callback();
      }
    },
    // Change the amp volume
    function(callback) {
      if('volume' in req.body) {
        if(req.body.volume === 'up') {
          lirc.irsend.send_once("amp", "volUp", function() {
            currentVol++;
            callback(null, {'success' : {'amp/state/volume' : currentVol }});
          });
        } else if (req.body.volume === 'down') {
          lirc.irsend.send_once("amp", "volDown", function() {
            currentVol--;
            callback(null, {'success' : {'amp/state/volume' : currentVol }});
          });
        } else {
          var relativeVol = req.body.volume - currentVol;
          if(relativeVol > 0) {
            lirc.irsend.send_once("amp", Array.apply(null, Array(Math.abs(relativeVol))).map(String.prototype.valueOf,"volUp"), function() {
              currentVol = req.body.volume;
              callback(null, {'success' : {'amp/state/volume' : currentVol }});
            });
          } else if (relativeVol < 0) {
            lirc.irsend.send_once("amp", Array.apply(null, Array(Math.abs(relativeVol))).map(String.prototype.valueOf,"volDown"), function() {
              currentVol = req.body.volume;
              callback(null, {'success' : {'amp/state/volume' : currentVol }});
            });
          } else {
            callback(null, {'success' : {'amp/state/volume' : currentVol }});
          }
        }
      } else {
        callback();
      }
    },
    // Turn mute on/off
    function(callback) {
      if('mute' in req.body) {
        if(req.body.mute && !currentMute) {
          lirc.irsend.send_once("amp", "muting", function() {
            currentMute = true;
            callback(null, { 'success' : { 'amp/state/mute' : currentMute }});
          });
        } else if (!req.body.mute && currentMute) {
          lirc.irsend.send_once("amp", "muting", function() {
            currentMute = false;
            callback(null, { 'success' : { 'amp/state/mute' : currentMute }});
          });
        } else {
          callback(null, { 'success' : { 'amp/state/mute' : currentMute }});
        }
      } else {
        callback();
      }
    }

  ], function(err, results) {
    if(!err) {
      if(results.filter(Boolean).length !== Object.keys(req.body).length)
      {
        results.push({ 'error' : { 'description' : 'Some options were invalid and not processed' }});
        res.status(400).json(results.filter(Boolean));
      } else {
        res.status(200).json(results.filter(Boolean));
      }
    }
  });

});

router.get ('/', function(req, res) {
  res.status(200).json({ 'state' : { 'on' : currentOn, 'source' : currentSource, 'volume' : currentVol, 'mute' : currentMute }});
});

module.exports = router;
