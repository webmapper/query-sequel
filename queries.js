var sql = require('sql');
var defs = require('./defs.js');

//define queries for our application.

/*
what are actually queries we need?

buurten:
select name, sum(dumps) dumps, avg(fillperc) fillperc, sum(melds) melds from schiedam.combined group by name;
--if date: where date = $1
--if daterange: where date >= $1 and date <= $2

buurt:
--if date:
    select name, dumps, fillperc, melds from schiedam.combined where name = $1 and date = $2;
--if daterange:
    select name, dumps, fillperc, melds from schiedam.combined where name = $1 and date >= $2 and date <= $3;
*/

function setDefaultParams(params) {
    if (!params.date) {
        params.date = '2015-06-30';
    };
	if (!params.summarize) {
		params.summarize = false
	}
	if (params.agg) {
		params.summarize = params.agg
	}
    return params;

}

function buildQuery(params, path) {
    //the basic idea is to choose a query set based on path,
    //then compose the query based on params.
    //how to do it elegantly?
    params = setDefaultParams(params);
    var c = defs.combined;
    //query is parameterized, with 'text' and 'values'.
    var query;
    //'/buurt' can now only take one.
    // could create JSON structures, nested, and return those, but that's more complicated.
	if (params.summarize === 'true') {
        query = c.select(c.bu_code,c.name,sql.functions.SUM(c.dumps).as('dumps'),sql.functions.AVG(c.fillperc).as('fillperc'))
        .from(c);
        if(params.start && params.end) {
            query.where((c.date).gte(params.start),(c.date).lte(params.end));
        } else if (params.date) {
            query.where((c.date).equals(params.date));
        }
        if (params.name) {
            query.and((c.name).equals(params.name));
        }
        query.group(c.name, c.bu_code);
    }
    else {
        query = c.select(c.date,c.bu_code,c.name, c.dumps, c.fillperc).from(c);
        if(params.start && params.end) {
            query.where((c.date).gte(params.start),(c.date).lte(params.end));
        } else if (params.date) {
            query.where((c.date).equals(params.date));
        }
        if (params.name) {
            query.where({name:params.name});
        }

    }
    //console.log('DEBUG: QUERY COMPOSITION');
    //console.log(query.toQuery());
    return query.toQuery();

}

module.exports = buildQuery;
