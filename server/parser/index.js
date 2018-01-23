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
    parseTerm: function (term, body, termDataInstantiatedCallback) {
        debug('Parsing html');
        var $ = cheerio.load(body);

        var $code = $('CODE');
        var $def = $('def');

        var code = $code.text();
        var def = $def.text();

        if (code.length === 0) {
            termDataInstantiatedCallback(null, false);
            return;
        }

        var termObject = {
            term: term,
            eid: Number(code.split('(eid=')[1].split(')')[0]),
            def: [],
            nodes: [],
            relations: []
        };

        var defArray = def.split(/\n[0-9]+. /);
        defArray.forEach(element => {
            if (!(/^\n*$/.test(element))) {
                termObject['def'].push(element);
            }
        });

        var lines = code.split('\n');
        Promise.all(lines.map((element, index) => {
            var elements = element.split(';');

            if (/^nt;[0-9]+/.test(element)) { //node type
                var nodeType = {
                    nt: elements[0],
                    ntid: elements[1],
                    ntname: elements[2]
                }
                termObject.nodes.push(nodeType);

            } else if (/^e;/.test(element)) { //entry
                termObject['nodes'].map((node, index) => {
                    if (node.ntid == elements[3]) {
                        node['entries'] = (node['entries'] === undefined) ? node['entries'] = [] : node['entries'] = node['entries'];
                        node['entries'].push({
                            e: elements[0],
                            eid: elements[1],
                            name: elements[2],
                            type: elements[3],
                            w: elements[4],
                            formatted_name: (elements.length === 6) ? elements[5] : ''
                        });
                    }
                });

            } else if (/^rt;/.test(element)) { //relation type
                termObject['relations'].push({
                    rt: elements[0],
                    rtid: elements[1],
                    rtname: elements[2],
                    rtgpname: elements[3],
                    rthelp: (elements.length === 5) ? elements[4] : ''
                });

            } else if (new RegExp("^r;[0-9]+;" + termObject['eid']).test(element)) { //outgoing relation

                termObject['relations'].map((relation, index) => {
                    if (relation.rtid == elements[4]) {
                        relation['outRels'] = (relation['outRels'] === undefined) ? relation['outRels'] = [] : relation['outRels'] = relation['outRels'];
                        relation['outRels'].push({
                            r: elements[0],
                            rid: elements[1],
                            node1: elements[2],
                            node2: elements[3],
                            type: elements[4],
                            w: elements[5]
                        });
                    }
                });

            } else if (new RegExp("^r;[0-9]+;[0-9]+;" + termObject['eid']).test(element)) { //incoming relation
                termObject['relations'].map((relation, index) => {
                    if (relation.rtid == elements[4]) {
                        relation['inRels'] = (relation['inRels'] === undefined) ? relation['inRels'] = [] : relation['inRels'] = relation['inRels'];
                        relation['inRels'].push({
                            r: elements[0],
                            rid: elements[1],
                            node1: elements[2],
                            node2: elements[3],
                            type: elements[4],
                            w: elements[5]
                        });
                    }
                });
            }
        })).then(function () {
            debug('Full term data instantiated');
            termDataInstantiatedCallback(termObject, true);

            var promiseNodes = Promise.all(termObject['nodes'].map(node => {
                delete node['entries'];
            }));
            var promiseRelations = Promise.all(termObject['relations'].map(relation => {
                delete relation['outRels'];
                delete relation['inRels'];
            }));

            debug('Partial term data instantiated');
            Promise.all([promiseNodes, promiseRelations]).then(termDataInstantiatedCallback(termObject, false));
        });
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
    getTermData: function (term, termDataInstantiatedCallback) {
        module.exports.fetchHTML(term, function (term, code) {
            module.exports.parseTerm(term, code, termDataInstantiatedCallback);
        });
    }

};