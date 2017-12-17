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
        parser.getData(element, function (data) {
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
          db.getTermData(term, function (termData) {
            termRetrievedCallback(termData);
            parser.getTermData(termData.term, function (termData, complete) {
              if (complete === true) {
                db.save(termData);
              }
            });
          });
          //Else fetch it from RezoDump
        } else {
          parser.getTermData(term, function (termData, complete) {
            if (complete === true) {
              db.save(termData);
            } else {
              termRetrievedCallback(termData);
            }
          });
        }
      });
    },

    getNodes: function (eid, nodesRetrievedCallback) {
      db.getNodes(eid, function (data) {
        nodesRetrievedCallback(data);
      })
    },

    getRelations: function (eid, relationsRetrievedCallback) {
      db.getRelations(eid, function (data) {
        relationsRetrievedCallback(data);
      })
    },

    getOutRels: function (eid, page, pageSize, outRelsRetrievedCallback) {
      db.getOutRels(eid, page, pageSize, function (data) {
        outRelsRetrievedCallback(data);
      })
    },

    getInRels: function (eid, page, pageSize, inRelsRetrievedCallback) {
      db.getInRels(eid, page, pageSize, function (data) {
        inRelsRetrievedCallback(data);
      })
    },

    getEntries: function (eid, page, pageSize, entriesRetrievedCallback) {
      db.getEntries(eid, page, pageSize, function (data) {
        entriesRetrievedCallback(data);
      })
    }
  }
}