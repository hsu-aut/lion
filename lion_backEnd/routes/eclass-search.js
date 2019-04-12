
var express = require('express');
var router = express.Router();
var url = require('url');
var sqlSelect = require('../sql_util/sqlSELECT');



/* GET properties list by name */
router.get('/list', function(req, res, next) {

    // res.writeHead(200, {'Content-Type': 'text/html'});
    //var q is for the query string that was sent to the server
    var q = url.parse(req.url, true).query;

    // sql select SELECT * FROM eclass_basic_9_1_properties.eclass9_1_pr_de WHERE PreferredName LIKE '%${propertyName}%
    sqlSelect.selectEclassProperties(q.prop).then(function(result) {
        // http response sent to client
        res.end(JSON.stringify(result)); 
      });
});

module.exports = router;



