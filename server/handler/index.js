const debug = require('debug')('handler');
const schedule = require('node-schedule');
const parser = require('../parser');

debug('Initializing handler');

// Usually expects "db" as an injected dependency to manipulate the models
module.exports = function (db) {
  var job = schedule.scheduleJob('* 3 * * 1', function () {
    debug('Starting scheduled job');
    db.getAllTerms(function (terms) {
      terms.forEach(element => {
        debug('Updating term: ' + element['term']);
        parser.getData(element['term'], function (data) {
          db.save(data);
        });
      });
    });
  });

  return {

    /**
     * Display the required term (optionally filtered by relation type)
     */
    getTerm: function (term, termRetrievedCallback) {
      var termObject = {};

      //If the term data is in the database, load it from there
      db.has(term, function (has) {
        if (has) {
          db.getTermData(term, function(termData) {
            termRetrievedCallback(termData);
            parser.getTermData(termData.term, function (termData, complete) {
              if (complete) {
                db.save(termData);              
              }
            });
          });
          //Else fetch it from RezoDump
        } else {
          parser.getTermData(term, function (termData, complete) {
            if (complete) {
              db.save(termData);              
            } else {
              termRetrievedCallback(termData);
            }
          });
        }
      });
    },


    getAllTerms: function (termsRetrievedCallback) {
      db.getAllTerms(function (terms) {
        termsRetrievedCallback(terms);
      });
    },

    getRelations: function (category, eid, page, pageSize, dataRetrievedCallback) {
      db.getRelations(category, eid, page, pageSize, function (data) {
        dataRetrievedCallback(data);
      });
    },

    getAllRelations: function (category, eid, dataRetrievedCallback) {
      db.getAllRelations(category, eid, function (data) {
        dataRetrievedCallback(data);
      });
    }
  }
}