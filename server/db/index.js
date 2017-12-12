const debug = require('debug')('db');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;  
const url = process.env.MONGODB_URI;
const assert = require('assert');

const dbname = 'heroku_b43v72jl';

debug('Initializing db');

module.exports = {

  getAllTerms: function(listRetrievedCallback){
    terms = [];
    mongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      var db = client.db(dbname);      
      db.collection('terms').find({}).toArray(function(err, elements){
        Promise.all(
          elements.map(function(element){
            terms.push(element);
          })
        ).then(
          listRetrievedCallback(terms)
        );
      });
    });
  },

  save: function(data){
    mongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      var db = client.db(dbname);
      
      var term = data['term'],
        entries = data['entries'],
        outRels = data['outRels'],
        inRels = data['inRels'];

      db.collection('terms').update({eid: term['eid']}, term, {upsert: true}, function(err) {
        if(err) throw err;
        debug('db', 'Term ' + term['term'] + ' added to database');
      });

      db.collection('entries' + term['eid']).remove(function(err) {
        if(err) throw err;
        debug('db', 'Entries for ' + term['term'] + ' deleted');
        
        if(entries.length > 0) {          
          db.collection('entries' + term['eid']).insertMany(entries, function(err) {
            if(err) throw err;
            debug('db', 'Entries for ' + term['term'] + ' added'); 
          });
        }   
      });
      
      db.collection('outRels' + term['eid']).remove(function(err) {
        if(err) throw err;
        debug('db', 'Outwards relations for ' + term['term'] + ' deleted');  
        
        if(outRels.length > 0) {          
          db.collection('outRels' + term['eid']).insertMany(outRels, function(err) {
            if(err) throw err;
            debug('db', 'Outwards relations for ' + term['term'] + ' added'); 
          });
        }
      });
      
      db.collection('inRels' + term['eid']).remove(function(err) {
        if(err) throw err;
        debug('db', 'Inwards relations for ' + term['term'] + ' deleted');  
        
        if(inRels.length > 0) {
          db.collection('inRels' + term['eid']).insertMany(inRels, function(err) {
            if(err) throw err;
            debug('db', 'Inwards relations for ' + term['term'] + ' added');  
          });
        }
      });      
    });
  },

  getTermData: function(_term, termRetrievedCallback){
    debug('db', 'Retrieving term ' + _term + ' from database');
    mongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      var db = client.db(dbname);      
      var termObject = {};
      
      db.collection('terms').findOne( {term: _term }, function(err, obj){
        if(err) throw err;
        termObject = obj; 
        termRetrievedCallback(termObject);
      });            
    });
  },

  getFullData: function(_term, fullDataRetrievedCallback){
    debug('db', 'Retrieving term ' + _term + ' from database');
    mongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      var db = client.db(dbname);      
      var termObject = {};
      
      var dataObject = {};        
      dataObject['term'] = termObject;    
      dataObject['entries'] = [];
      dataObject['outRels'] = [];
      dataObject['inRels'] = [];
      
      //TODO: Retrieve the collections related to the term in an async manner instead of sequentially
      db.collection('terms').findOne( {term: _term }, function(err, obj){
        if(err) throw err;
        termObject = obj; 
        dataObject['term'] = termObject;

        db.collection('entries' + termObject['eid']).find({}).toArray(function(err, elements){
          Promise.all(
            elements.map(function(element){
              dataObject['entries'].push(element);
            })
          ).then(function(){
            debug('db','Entries retrieved from database');

            db.collection('outRels' + termObject['eid']).find({}).toArray(function(err, elements){
              Promise.all(
                elements.map(function(element){
                  dataObject['outRels'].push(element);
                })
              ).then(function(){
                debug('db','outRels retrieved from database');

                db.collection('inRels' + termObject['eid']).find({}).toArray(function(err, elements){          
                  Promise.all(
                    elements.map(function(element){
                      dataObject['inRels'].push(element);
                    })
                  ).then(function(){
                    debug('db','inRels retrieved from database');
                    fullDataRetrievedCallback(dataObject);
                  });
                });
              });
            });
          });
        });
      });            
    });
  },

  has: function(_term, hasCallback){
    mongoClient.connect(url, function(err, client) {
      assert.equal(null, err); 
      var db = client.db(dbname);
      var found;
      db.collection('terms').count( {term: _term}, function(err, res){
        if(err) throw err;
        if(res > 0) {
          debug('db', 'Found term ' + _term + ' in database');
          found = true;
        } else { 
          debug('db', 'Did not find term ' + _term + ' in database'); 
          found = false;
        }
        hasCallback(found);
      });
    });
  }
};