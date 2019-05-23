
var express = require('express');
var router = express.Router();
var url = require('url');
var sqlSelect = require('../sql_util/sqlSELECT');
var http = require('http');



/* GET properties list by name */
router.get('/vdi3682', function (req, res, next) {

    var url = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%203682/VDI3682.owl"
    // var q = url.parse(req.url, true).query;

    http.get({
        hostname: 'raw.githubusercontent.com',
        port: 443,
        path: '/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%203682/VDI3682.owl',
        agent: false  // Create a new agent just for this one request
    }, (res) => {
        console.log(res)
    }, (err) => {
        console.log(err)
    }
    );


    // sql select SELECT * FROM eclass_basic_9_1_properties.eclass9_1_pr_de WHERE PreferredName LIKE '%${propertyName}%
    // sqlSelect.selectEclassProperties(q.prop).then(function (result) {
    //     // http response sent to client
    //     res.end(JSON.stringify(result));
    // });

    res.end("hello");
});

module.exports = router;



