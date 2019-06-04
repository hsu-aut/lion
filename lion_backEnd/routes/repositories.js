var express = require('express');
var router = express.Router();
var url = require('url');

var repo = require('../public/HTTP_Client_Requests/GDB_Requests')
var gdbConfig = require('../public/GraphDB_Repository_Config/GDBconfigurator')

const curl = new (require('curl-request'))();


/* CREATE new repository */
router.get('/create', function (req, res, next) {

    var q = url.parse(req.url, true).query;
    var repositoryName = q.repositoryName;

    gdbConfig.setRepository(repositoryName).then(function (response) {
        curl
            .setHeaders([
                'Content-Type: multipart/form-data'
            ])
            .setMultipartBody([{
                name: 'config',
                contents: 'repo-config.ttl'
            }, {
                name: 'config',
                file: './GRAPHDB_NEW_REPO_CONFIG.ttl',
                type: 'rb'
            }])
            .post('http://localhost:7200/rest/repositories')
            .then(({ statusCode, body, headers }) => {
                console.log(statusCode, body, headers)
                res.status(statusCode).json(body)
                res.end();
            })
            .catch((e) => {
                console.log(e);
                res.status(500)
                res.end();
            });
    })
});

/* GET all RDF triples  */
router.get('/', function (req, res, next) {

    var q = url.parse(req.url, true).query;
    var repositoryName = q.repositoryName;
    var withTBox = q.withTBox;

    repo.getAllTriples(repositoryName).then(function (response) {

        if (response.status == 200) {
            res.status(200);
            res.end(response.data);
        } else {
            res.status(500);
            res.end();
        }

    })
        .catch(function (error) {
            console.log(error);
            res.status(500);
            res.end();
        });

});

/* DELETE all RDF triples  */
router.get('/clear', function (req, res, next) {

    var q = url.parse(req.url, true).query;
    var repositoryName = q.repositoryName;

    repo.clearRepository(repositoryName).then(function (response) {

        if (response.status == 204) {
            res.status(200);
            res.end(response.data);
        } else {
            res.status(500);
            res.end();
        }

    })
        .catch(function (error) {
            console.log(error);
            res.status(500);
            res.end();
        });

});

/* INSERT TBOX to repository  */
router.get('/buildTBox', function (req, res, next) {


    var q = url.parse(req.url, true).query;
    var pattern = q.pattern;
    var repositoryName = q.repositoryName;

    repo.insertTBOX(pattern, repositoryName).then(function (response) {

        if (response == 204) {
            res.status(200);
            res.end();
        } else {
            res.status(500);
            res.end();
        }

    })
        .catch(function (error) {
            console.log(error);
            res.status(500);
            res.end();
        });

});



module.exports = router;