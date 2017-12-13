const debug = require('debug')('routes');
const express = require('express');
const router = express.Router();
const db = require('../db');
const handler = require('../handler')(db);

debug('Intializing routes');

router.get('/terms/:term', function (req, res) {
  var term = req.params.term.toLowerCase();
  debug('Looking for ' + term);
  handler.getTerm(term, function (termData) {
    res.json(termData);
  })
});

module.exports = router;