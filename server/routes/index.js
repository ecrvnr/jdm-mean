const debug = require('debug')('routes');
const express = require('express');
const router = express.Router();
const db = require('../db');
const handler = require('../handler')(db);

debug('Intializing routes');

//terms routes
router.get('/terms/:term', function (req, res) {
  var term = req.params.term.toLowerCase();
  debug('Retrieving term ' + term);
  handler.getTerm(term, function (termData) {
    res.json(termData);
  })
});

router.get('/terms', function (req, res) {
  debug('Retrieving all terms');
  handler.getAllTerms(function (data) {
    res.json(data);
  });
});


router.get('/terms/nodes/:eid', function (req, res) {
  var eid = Number(req.params.eid);
  debug('Retrieving nodes for eid ' + eid);
  handler.getNodes(eid, function (data) {
    res.json(data);
  });
});

router.get('/terms/relations/:eid', function (req, res) {
  var eid = Number(req.params.eid);
  debug('Retrieving relations for eid ' + eid);
  handler.getRelations(eid, function (data) {
    res.json(data);
  });
});


module.exports = router;