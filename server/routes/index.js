const debug = require('debug')('routes');
const express = require('express');
const router = express.Router();
const db = require('../db');
const handler = require('../handler')(db);

debug('Intializing routes');

//get a term's data, identified by the term itself
router.get('/terms/:term', function (req, res) {
  var term = req.params.term.toLowerCase();
  debug('Retrieving term ' + term);
  handler.getTerm(term, function (termData) {
    res.json(termData);
  })
});

//get all terms' data
router.get('/terms', function (req, res) {
  debug('Retrieving all terms');
  handler.getAllTerms(function (data) {
    res.json(data);
  });
});

//get $pageSize entries from a term identified by its eid, starting at page $page
router.get('/terms/:eid/entries/:page/:pageSize', function (req, res) {
  var eid = Number(req.params.eid);
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);  
  debug('Retrieving page ' + page + ' of entries for eid ' + eid + ' with page size = ' + pageSize);
  handler.getEntries(eid, page, pageSize, function (data) {
    res.json(data);
  });
});

//get $pageSize outgoing relations from a term identified by its eid, starting at page $page
router.get('/terms/:eid/outrels/:page/:pageSize', function (req, res) {
  var eid = Number(req.params.eid);
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);  
  debug('Retrieving page ' + page + ' of outgoing relations for eid ' + eid + ' with page size = ' + pageSize);
  handler.getOutRels(eid, page, pageSize, function (data) {
    res.json(data);
  });
});

//get $pageSize incoming relations from a term identified by its eid, starting at page $page
router.get('/terms/:eid/inrels/:page/:pageSize', function (req, res) {
  var eid = Number(req.params.eid);
  var page = Number(req.params.page);
  var pageSize = Number(req.params.pageSize);  
  debug('Retrieving page ' + page + ' of incoming relations for eid ' + eid + ' with page size = ' + pageSize);
  handler.getInRels(eid, page, pageSize, function (data) {
    res.json(data);
  });
});


module.exports = router;