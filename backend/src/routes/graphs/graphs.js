var express = require('express');
var router = express.Router();
var url = require('url');

// scripts that hold the HTTP requests to the GraphDB
var GDB_GRAPH = require('../../GRAPH_DB_REQUESTS/graphOperations.requests');

/* GET TRIPLES OF NAMED GRAPH */
router.get('/', function (req, res, next) {

	var q = url.parse(req.url, true).query;
	const repositoryName = q.repositoryName;
	const graph = q.graph;
	const format = req.headers.accept;
	if (repositoryName == null || graph == null) {
		res.status(500).send({ error: 'Query parameter repositoryName and graph cannot be null' });
		res.end();
	} else {

		GDB_GRAPH.GET_ALL_TRIPLES(graph, repositoryName, format).then(function (response) {

			if (response.status == 200) {
				res.status(200);
				res.end(response.data);
			} else {
				res.status(response.status).send({ error: response.data });
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

/* SET TRIPLES OF NAMED GRAPH */
router.put('/', function (req, res, next) {

	var q = url.parse(req.url, true).query;
	var triples = req.body;

	const repositoryName = q.repositoryName;
	const graph = q.graph;
	const format = req.headers.accept;

	if (repositoryName == null || graph == null) {
		res.status(500).send({ error: 'Query parameter repositoryName and graph cannot be null' });
		res.end();
	} else {

		GDB_GRAPH.SET_GRAPH(graph, repositoryName, format, triples).then(function (response) {

			if (response.status == 200) {
				res.status(200);
				res.end(response.data);
			} else {
				res.status(response.status).send({ error: response.data });
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

/* DELETE NAMED GRAPH */
router.delete('/', function (req, res, next) {

	var q = url.parse(req.url, true).query;

	const repositoryName = q.repositoryName;
	const graph = q.graph;


	if (repositoryName == null || graph == null) {
		res.status(500).send({ error: 'Query parameter repositoryName and graph cannot be null' });
		res.end();
	} else {

		GDB_GRAPH.DELETE_GRAPH(graph, repositoryName).then(function (response) {

			if (response.status == 200) {
				res.status(200);
				res.end(response.data);
			} else {
				res.status(response.status).send({ error: response.data });
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
