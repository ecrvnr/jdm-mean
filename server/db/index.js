const debug = require('debug')('db');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = process.env.MONGODB_URI;
const dbname = 'heroku_b43v72jl';
var db;

debug('Initializing db');
mongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  debug('Connected to MongoDB database');
  db = client.db(dbname);
});

module.exports = {

  getAllTerms: function (listRetrievedCallback) {
    debug('Retrieving all terms from database');
    terms = [];
    db.collection('terms').find({}).toArray(function (err, elements) {
      Promise.all(
        elements.map(function (element) {
          terms.push(element);
        })
      ).then(
        listRetrievedCallback(terms)
        );
    });
  },

  save: function (termData) {
    debug('Saving term ' + termData.term + ' to database');
    db.collection('terms').updateOne({ eid: termData.eid }, { $set: termData }, { upsert: true }, function (err, res) {
      assert(err === null);
      debug('Term ' + termData.term + ' saved to database')
    });
  },

  getTermData: function (_term, termDataRetrievedCallback) {
    debug('Getting term ' + _term + ' from database');
    db.collection('terms').findOne({ term: _term }, function (err, res) {
      assert(err === null);
      res['nodes'] = [];
      res['relations'] = [];      
      termDataRetrievedCallback(res);
      debug('Retrieved term ' + _term + ' from database');
    });
  },

  has: function (_term, hasCallback) {
    var found;
    db.collection('terms').count({ term: _term }, function (err, res) {
      if (err) throw err;
      if (res > 0) {
        debug('Found term ' + _term + ' in database');
        found = true;
      } else {
        debug('Did not find term ' + _term + ' in database');
        found = false;
      }
      hasCallback(found);
    });
  },

  getRelations: function (category, eid, page, pageSize, dataRetrievedCallback) {
    debug(pageSize);
    switch (category) {
      case 'out':
        db.collection('outRels' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;

      case 'in':
        db.collection('inRels' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;

      case 'entries':
        db.collection('entries' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;
    }
  },

  getAllRelations: function (category, eid, dataRetrievedCallback) {
    switch (category) {
      case 'out':
        db.collection('outRels' + eid).find({}).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;

      case 'in':
        db.collection('inRels' + eid).find({}).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;

      case 'entries':
        db.collection('entries' + eid).find({}).toArray(function (err, elements) {
          dataRetrievedCallback(elements);
        });
        break;
    }
  }
};