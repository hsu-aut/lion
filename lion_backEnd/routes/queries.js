var express = require('express');
var router = express.Router();
var url = require('url');

// scripts that hold the HTTP requests to the GraphDB
var GDB = require('../GRAPH_DB_REQUESTS/sparqlQueries.requests')


/* POST SELECT */
router.post('/', function(req, res, next) {
    
    var q = url.parse(req.url, true).query;

    let repositoryName = q.repositoryName;
    let SELECT_QUERY = req.body;

    if(repositoryName == null){
        res.status(500).send({ error: 'Query parameter repositoryName cannot be null' });
        res.end();
    } else {

    GDB.SAPRQL_SELECT(SELECT_QUERY, repositoryName).then(function (response) {

        if (response.status == 200) {
            res.status(200);
            res.end(response.data);
        } else {
            res.status(response.status).send({ error: 'The GraphDB responded with 400. That usually points to an issue in the query.' })
            res.end();
        }

    })
        .catch(function (error) {
            console.log(error);
            res.status(500).send({ error: 'An unhandled error occured' });
            res.end();
        });
    }
});  


/* POST INSERT */
router.post('/statements', function(req, res, next) {

    var q = url.parse(req.url, true).query;

    let repositoryName = q.repositoryName;
    let UPDATE_QUERY = req.body;

    if(repositoryName == null){
        res.status(500).send({ error: 'Query parameter repositoryName cannot be null' });
        res.end();
    } else {
    GDB.SAPRQL_UPDATE(UPDATE_QUERY, repositoryName).then(function (response) {

        if (response.status == 204) {
            res.status(204);
            res.end(response.data);
        } else {
            res.status(response.status).send({ error: 'The GraphDB responded with 400. That usually points to an issue in the query.' })
            res.end();
        }

    })
        .catch(function (error) {
            console.log(error);
            res.status(500).send({ error: 'An unhandled error occured' });
            res.end();
        });
    }

}); 


/* GET TRIPLES OF NAMED GRAPH */

/* DELETE NAMED GRAPH */

/* DELETE TRIPLES OF NAMED GRAPH */

/* DELETE NAMED GRAPH */



module.exports = router;