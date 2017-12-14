const debug = require('debug')('parser');
const cheerio = require('cheerio');
const request = require('request');
const charset = require('charset');
const jschardet = require('jschardet');
const Iconv = require('iconv').Iconv;

debug('Initializing parser');

module.exports = {

  /**
   * Parse the code to fill up our data structure
   */
  parseFull: function (term, body, fullDataInstantiatedCallback) {
    debug('Parsing html');
    var $ = cheerio.load(body);

    var $code = $('CODE');
    var $def = $('def');

    var code = $code.text();
    var def = $def.text();

    if(Object.keys(code).length === 0){
      fullDataInstantiatedCallback({});
      return;
    }

    var termObject = {};
    termObject['term'] = term;
    termObject['eid'] = Number(code.split('(eid=')[1].split(')')[0]);
    termObject['def'] = [];
    termObject['relTypes'] = [];
    termObject['nodeTypes'] = [];

    var dataObject = {};
    dataObject['term'] = termObject;
    dataObject['entries'] = [];
    dataObject['outRels'] = [];
    dataObject['inRels'] = [];

    var defArray = def.split(/\n[0-9]+. /);
    defArray.forEach(element => {
      if (element != '' && element != '\n') {
        termObject['def'].push(element);
        //debug(element);                 
      }
    });

    var lines = code.split('\n');
    var lineType;
    lines.forEach(element => {
      if (element.indexOf('Nodes Types') != -1) {
        lineType = 'nodeType';
      } else if (element.indexOf('Entries') != -1) {
        lineType = 'entry';
      } else if (element.indexOf('Relation Types') != -1) {
        lineType = 'relType';
      } else if (element.indexOf('relations sortantes') != -1) {
        lineType = 'outRel';
      } else if (element.indexOf('relations entrantes') != -1) {
        lineType = 'inRel';
      } else if (element.length > 4) {
        var fields;
        switch (lineType) {
          case 'nodeType':
            var nodeTypeObject = {};
            fields = element.split(';');
            nodeTypeObject['nt'] = fields[0];
            nodeTypeObject['ntid'] = Number(fields[1]);
            nodeTypeObject['ntname'] = fields[2].split('\'')[1];
            termObject['nodeTypes'].push(nodeTypeObject);
            //debug(nodeTypeObject);
            break;

          case 'entry':
            var entryObject = {};
            fields = element.split(';');
            entryObject['e'] = fields[0];
            entryObject['eid'] = Number(fields[1]);
            entryObject['name'] = fields[2].split('\'')[1];
            entryObject['type'] = Number(fields[3]);
            entryObject['w'] = Number(fields[4]);
            entryObject['formatted_name'] = fields[5];
            if (entryObject['formatted_name'] != undefined) {
              entryObject['formatted_name'] = entryObject['formatted_name'].split('\'')[1];
            }
            dataObject['entries'].push(entryObject);
            //debug(entryObject);            
            break;

          case 'relType':
            var relTypeObject = {};
            fields = element.split(';');
            relTypeObject['rt'] = fields[0];
            relTypeObject['rtid'] = Number(fields[1]);
            relTypeObject['rtname'] = fields[2].split('\'')[1];
            relTypeObject['rtgpname'] = fields[3].split('\'')[1];
            relTypeObject['rthelp'] = fields[4];
            termObject['relTypes'].push(relTypeObject);
            //debug(relTypeObject);            
            break;

          case 'outRel':
            var outRelObject = {};
            fields = element.split(';');
            outRelObject['r'] = fields[0];
            outRelObject['rid'] = Number(fields[1]);
            outRelObject['node1'] = Number(fields[2]);
            outRelObject['node2'] = Number(fields[3]);
            outRelObject['type'] = Number(fields[4]);
            outRelObject['w'] = Number(fields[5]);
            dataObject['outRels'].push(outRelObject);
            //debug(outRelObject);            
            break;

          case 'inRel':
            var inRelObject = {};
            fields = element.split(';');
            inRelObject['r'] = fields[0];
            inRelObject['rid'] = Number(fields[1]);
            inRelObject['node1'] = Number(fields[2]);
            inRelObject['node2'] = Number(fields[3]);
            inRelObject['type'] = Number(fields[4]);
            inRelObject['w'] = Number(fields[5]);
            dataObject['inRels'].push(inRelObject);
            //debug('parser', inRelObject);            
            break;

          default:
            break;
        }
      }
    });

    debug('Term JSON Object created');
    Promise.all(termObject['def'].map(function (element, index) {
      if (/\n*/.test(element)) {
        termObject['def'].splice(index, 1);
      }
    })).then(function () {
      fullDataInstantiatedCallback(dataObject);
    })
  },


  parseTerm: function (term, body, termDataInstantiatedCallback) {
    debug('Parsing html');
    var $ = cheerio.load(body);

    var $code = $('CODE');
    var $def = $('def');

    var code = $code.text();
    var def = $def.text();

    
    if(Object.keys(code).length === 0){
      termDataInstantiatedCallback({});
      return;
    }

    var termObject = {};
    termObject['term'] = term;
    termObject['eid'] = Number(code.split('(eid=')[1].split(')')[0]);
    termObject['def'] = [];
    termObject['relTypes'] = [];
    termObject['nodeTypes'] = [];


    var defArray = def.split(/\n[0-9]+. /);
    defArray.forEach(element => {
      if (element != '' && element != '\n') {
        termObject['def'].push(element);
        //debug(element);                 
      }
    });

    var lines = code.split('\n');
    var lineType;
    lines.forEach(element => {
      if (element.indexOf('Nodes Types') != -1) {
        lineType = 'nodeType';
      } else if (element.indexOf('Entries') != -1) {
        lineType = 'entry';
      } else if (element.indexOf('Relation Types') != -1) {
        lineType = 'relType';
      } else if (element.indexOf('relations sortantes') != -1) {
        lineType = 'outRel';
      } else if (element.indexOf('relations entrantes') != -1) {
        lineType = 'inRel';
      } else if (element.length > 4) {
        var fields;
        switch (lineType) {
          case 'nodeType':
            var nodeTypeObject = {};
            fields = element.split(';');
            nodeTypeObject['nt'] = fields[0];
            nodeTypeObject['ntid'] = Number(fields[1]);
            nodeTypeObject['ntname'] = fields[2].split('\'')[1];
            termObject['nodeTypes'].push(nodeTypeObject);
            //debug(nodeTypeObject);
            break;

          case 'relType':
            var relTypeObject = {};
            fields = element.split(';');
            relTypeObject['rt'] = fields[0];
            relTypeObject['rtid'] = Number(fields[1]);
            relTypeObject['rtname'] = fields[2].split('\'')[1];
            relTypeObject['rtgpname'] = fields[3].split('\'')[1];
            relTypeObject['rthelp'] = fields[4];
            termObject['relTypes'].push(relTypeObject);
            //debug(relTypeObject);            
            break;

          default:
            break;
        }
      }
    });

    debug('Term JSON Object created');
    termDataInstantiatedCallback(termObject);
  },

  /**
   * Fetch the html <CODE> content from Rezodump
   */
  fetchHTML: function (term, htmlFetchedCallback) {
    var url = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + term;
    request.get({ url: url, encoding: 'binary' }, function (err, response, body) {
      debug('Fetching HTML from ' + url);
      var enc = charset(response.headers, body) || jschardet.detect(body).encoding.toLowerCase();

      if (enc !== 'utf8') {
        var iconv = new Iconv(enc, 'UTF-8//TRANSLIT//IGNORE');
        body = iconv.convert(new Buffer(body, 'binary')).toString('utf8');
      }

      htmlFetchedCallback(term, body);
    });
  },

  /**
   * Get the term data from a term and relation type
   */
  getFullData: function (term, fullDataInstantiatedCallback) {
    module.exports.fetchHTML(term, function (term, code) {
      module.exports.parseFull(term, code, fullDataInstantiatedCallback);
    });
  },

  getTermData: function (term, termDataInstantiatedCallback) {
    module.exports.fetchHTML(term, function (term, code) {
      module.exports.parseTerm(term, code, termDataInstantiatedCallback);
    });
  }

};