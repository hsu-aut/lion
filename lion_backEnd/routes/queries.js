var express = require('express');
var router = express.Router();
var url = require('url');

// scripts that hold the HTTP requests to the GraphDB
var GDB_QUERY = require('../GRAPH_DB_REQUESTS/sparqlQueries.requests')


/* POST SELECT */
router.post('/', function (req, res, next) {

    var q = url.parse(req.url, true).query;

    let repositoryName = q.repositoryName;
    let sparqlQuery = req.body;

    if (repositoryName == null) {
        res.status(500).send({ error: 'Query parameter repositoryName cannot be null' });
        res.end();
    } else {

        GDB_QUERY.SAPRQL_SELECT(sparqlQuery, repositoryName).then(function (response) {

            if (response.status == 200) {
                res.status(200);
                res.end(response.data);
            } else {
                res.status(response.status).send({ error: response.data })
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
router.post('/statements', function (req, res, next) {

    var q = url.parse(req.url, true).query;

    let repositoryName = q.repositoryName;
    let sparqlQuery = req.body;

    if (repositoryName == null) {
        res.status(500).send({ error: 'Query parameter repositoryName cannot be null' });
        res.end();
    } else {

        GDB_QUERY.SAPRQL_UPDATE(sparqlQuery, repositoryName).then(function (response) {

            if (response.status == 204) {
                res.status(204);
                res.end(response.data);
            } else {
                res.status(response.status).send({ error: response.data })
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

module.exports = router;