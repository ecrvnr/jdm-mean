const debug = require('debug')('routes');
const express = require('express');
const router = express.Router();
const db = require('../db');
const handler = require('../handler')(db);

debug('Intializing routes');

//terms routes
router.get('/terms/:term', function (req, res) {
  var term = req.params.term.toLowerCase();
  debug('Looking for ' + term);
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

//out relations routes
router.get('/out/:eid', function (req, res) {
  var eid = req.params.eid;
  debug('Retrieving all out-relations for eid ' + eid);
  handler.getAllRelations(eid, function (data) {
    res.json(data);
  });
});

router.get('/out/:eid/:page/:pageSize', function (req, res) {
  var eid = req.params.eid;
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);
  debug('Retrieving one page (n°' + page + ', size: ' + pageSize + ') of out-relations for eid ' + eid);
  handler.getRelations("out", eid, page, pageSize, function (data) {
    res.json(data);
  });
});

//in relations routes
router.get('/in/:eid', function (req, res) {
  var eid = req.params.eid;
  debug('Retrieving all in-relations for eid ' + eid);
  handler.getAllRelations("in", eid, function (data) {
    res.json(data);
  });
});

router.get('/in/:eid/:page/:pageSize', function (req, res) {
  var eid = req.params.eid;
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);
  debug('Retrieving one page (n°' + page + ', size: ' + pageSize + ') of in-relations for eid ' + eid);
  handler.getRelations("in", eid, page, pageSize, function (data) {
    res.json(data);
  });
});

//entries routes
router.get('/entries/:eid', function (req, res) {
  var eid = req.params.eid;
  debug('Retrieving all entries for eid ' + eid);
  handler.getAllRelations("entries", eid, function (data) {
    res.json(data);
  });
});

router.get('/entries/:eid/:page/:pageSize', function (req, res) {
  var eid = req.params.eid;
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);
  debug('Retrieving one page (n°' + page + ', size: ' + pageSize + ') of entries for eid ' + eid);
  handler.getRelations("entries", eid, page, pageSize, function (data) {
    res.json(data);
  });
});

module.exports = router;