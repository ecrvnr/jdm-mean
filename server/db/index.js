const debug = require('debug')('db');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = process.env.MONGODB_URI;
const dbname = 'heroku_b43v72jl';
var db;

debug('Initializing db');
mongoClient.connect(url, function(err, client){
  assert.equal(null, err);
  debug('Connected to MongoDB database');
  db = client.db(dbname);
});

module.exports = {

  getAllTerms: function(listRetrievedCallback){
    debug('Retrieving all terms from database');
    terms = [];   
    db.collection('terms').find({}).toArray(function(err, elements){
      Promise.all(
        elements.map(function(element){
          terms.push(element);
        })
      ).then(
        listRetrievedCallback(terms)
      );
    });
  },

  save: function(data){
    var term = data['term'],
      entries = data['entries'],
      outRels = data['outRels'],
      inRels = data['inRels'];

    db.collection('terms').update({eid: term['eid']}, term, {upsert: true}, function(err) {
      if(err) throw err;
      debug('Term ' + term['term'] + ' added to database');
    });

    db.collection('entries' + term['eid']).remove(function(err) {
      if(err) throw err;
      debug('Entries for ' + term['term'] + ' deleted');
      
      if(entries.length > 0) {          
        db.collection('entries' + term['eid']).insertMany(entries, function(err) {
          if(err) throw err;
          debug('Entries for ' + term['term'] + ' added'); 
        });
      }   
    });
    
    db.collection('outRels' + term['eid']).remove(function(err) {
      if(err) throw err;
      debug('Outwards relations for ' + term['term'] + ' deleted');  
      
      if(outRels.length > 0) {          
        db.collection('outRels' + term['eid']).insertMany(outRels, function(err) {
          if(err) throw err;
          debug('Outwards relations for ' + term['term'] + ' added'); 
        });
      }
    });
    
    db.collection('inRels' + term['eid']).remove(function(err) {
      if(err) throw err;
      debug('Inwards relations for ' + term['term'] + ' deleted');  
      
      if(inRels.length > 0) {
        db.collection('inRels' + term['eid']).insertMany(inRels, function(err) {
          if(err) throw err;
          debug('Inwards relations for ' + term['term'] + ' added');  
        });
      }
    });      
  },

  getTermData: function(_term, termRetrievedCallback){
    debug('Retrieving term ' + _term + ' from database');
    var termObject = {};
    db.collection('terms').findOne( {term: _term }, function(err, obj){
      if(err) throw err;
      termObject = obj; 
      termRetrievedCallback(termObject);
    });            
  },

  getFullData: function(_term, fullDataRetrievedCallback){
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
          debug('Entries retrieved from database');

          db.collection('outRels' + termObject['eid']).find({}).toArray(function(err, elements){
            Promise.all(
              elements.map(function(element){
                dataObject['outRels'].push(element);
              })
            ).then(function(){
              debug('outRels retrieved from database');

              db.collection('inRels' + termObject['eid']).find({}).toArray(function(err, elements){          
                Promise.all(
                  elements.map(function(element){
                    dataObject['inRels'].push(element);
                  })
                ).then(function(){
                  debug('inRels retrieved from database');
                  fullDataRetrievedCallback(dataObject);
                });
              });
            });
          });
        });
      });
    });            
  },

  has: function(_term, hasCallback){
    var found;
    db.collection('terms').count( {term: _term}, function(err, res){
      if(err) throw err;
      if(res > 0) {
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
    switch(category){
      case 'out':
      db.collection('outRels' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
      
      case 'in':
      db.collection('inRels' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
      
      case 'entries':
      db.collection('entries' + eid).find({}).skip(pageSize * (page - 1)).limit(pageSize).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
    }
  },

  getAllRelations: function (category, eid, dataRetrievedCallback) {
    switch(category){
      case 'out':
      db.collection('outRels' + eid).find({}).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
      
      case 'in':
      db.collection('inRels' + eid).find({}).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
      
      case 'entries':
      db.collection('entries' + eid).find({}).toArray(function(err, elements){
        dataRetrievedCallback(elements);
      });
      break;
    }
  }
};