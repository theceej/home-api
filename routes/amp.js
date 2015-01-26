var express = require('express');
var router = express.Router();
var async = require('async');
var lirc = require('lirc_node');
lirc.init();

router.put('/state', function(req, res) {
  async.series([
    // Turn amp on and off using lirc
    function(callback) {
      if('on' in req.body) {
        if(req.body.on) {
          lirc.irsend.send_once("amp", "powerOn", function() {
            callback(null, { 'success' : { 'amp/state/on' : true }});
          });
        } else {
          lirc.irsend.send_once("amp", "powerOff", function() {
            callback(null, { 'success' : { 'amp/state/on' : false }});
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
              callback(null, { 'success' : { 'amp/state/source' : 'chromecast' }});
            });
            break;
          case 'ps3':
            lirc.irsend.send_once("amp", "game", function() {
              callback(null, { 'success' : { 'amp/state/source' : 'ps3' }});
            });
            break;
          case 'pi':
            lirc.irsend.send_once("amp", "cd", function() {
              callback(null, { 'success' : { 'amp/state/source' : 'pi' }});
            });
            break;
          case 'aux':
            lirc.irsend.send_once("amp", "aux", function() {
              callback(null, { 'success' : { 'amp/state/source' : 'aux' }});
            });
            break;
          case 'radio':
            lirc.irsend.send_once("amp", "tuner", function() {
              callback(null, { 'success' : { 'amp/state/source' : 'radio' }});
            });
            break;
          default:
            callback(null, { 'error' : { 'description' : 'Invalid source specified, valid options are "chromecase", "ps3", "pi", "aux" or "radio"'}});
            break;
        }
      } else {
        callback();
      }
    }

  ], function(err, results) {
    if(!err) {
      if(results.filter(Boolean) !== Object.keys(req.body).length)
      {
        results.push({ 'error' : { 'description' : 'Some options were invalid and not processed' }});
        res.status(400).json(results.filter(Boolean));
      } else {
        res.status(200).json(results.filter(Boolean));
      }
    }
  });

});

module.exports = router;
