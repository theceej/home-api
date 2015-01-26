var express = require('express');
var router = express.Router();

var lirc = require('lirc_node');
lirc.init();

router.put('/state', function(req, res) {
  console.log(req.body.length());
  // Turn amp on and off using lirc
  if('on' in req.body) {
    if(req.body.on) {
      lirc.irsend.send_once("amp", "powerOn", function() {
        res.status(200).json({ 'success' : { 'amp/state/on' : true }});
      });
    } else {
      lirc.irsend.send_once("amp", "powerOff", function() {
        res.status(200).json({ 'success' : { 'amp/state/on' : false }});
      });
    }
  }

  // Change the amp source
  if('source' in req.body) {
    switch(req.body.source)
    {
      case 'chromecast':
        lirc.irsend.send_once("amp", "vcrDvr", function() {
          res.status(200).json({ 'success' : { 'amp/state/source' : 'chromecast' }});
        });
        break;
      case 'ps3':
        lirc.irsend.send_once("amp", "game", function() {
          res.status(200).json({ 'success' : { 'amp/state/source' : 'ps3' }});
        });
        break;
      case 'pi':
        lirc.irsend.send_once("amp", "cd", function() {
          res.status(200).json({ 'success' : { 'amp/state/source' : 'pi' }});
        });
        break;
      case 'aux':
        lirc.irsend.send_once("amp", "aux", function() {
          res.status(200).json({ 'success' : { 'amp/state/source' : 'aux' }});
        });
        break;
      case 'radio':
        lirc.irsend.send_once("amp", "tuner", function() {
          res.status(200).json({ 'success' : { 'amp/state/source' : 'radio' }});
        });
        break;
      case default:
        res.status(400).json({'error' : { 'description' : 'Invalid source specified, valid options are "chromecase", "ps3", "pi", "aux" or "radio"'}})
    }
  }

});

// Turn amp on and off using lirc
router.put('/source', function(req, res) {
  if(typeof(req.body.on) === 'undefined') {
    res.status(400).json({ error : '"on" must be specified'})
  } else if(req.body.on) {
    lirc.irsend.send_once("amp", "powerOn", function() {
      res.status(200).json({ on : true });
    });
  } else {
    lirc.irsend.send_once("amp", "powerOff", function() {
      res.status(200).json({ on : false });
    });
  }
});

module.exports = router;
