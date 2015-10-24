var sql = require('sql');
var queries = require('./queries.js');

function queryIsInsane(params, path) {

    return false;
}

function processQuery(req, res, next) {
    if (queryIsInsane(req.query,req.path)) {
        res.send('this is insane');
    } else {
        req.processedQuery = queries(req.query, req.path);
        next();
    }
};

module.exports = processQuery;



