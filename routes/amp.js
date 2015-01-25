var express = require('express');
var router = express.Router();

var lirc = require('lirc_node');
lirc.init();

// Turn amp on and off using lirc
router.put('/power', function(req, res) {
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
