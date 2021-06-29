var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');

const IncomingForm = require('formidable').IncomingForm;
const GDB_GRAPH = require('../../GRAPH_DB_REQUESTS/graphOperations.requests');
const stepUtil = require('../../stp_util/parser');


/* post a step file and store it locally */
router.post('/', function (req, res, next) {

	var form = new IncomingForm();
	form.maxFileSize = 350 * 1024 * 1024;
	form.uploadDir = stepUtil.uploadDir;

	form.on('file', (field, file) => {
		fs.renameSync(file.path, stepUtil.uploadDir + "/" + file.name);
	});
	form.on('end', () => {
		res.status(200).json('Added file');
	});
	form.parse(req);
});

/* GET list of current files */
router.get('/', function (req, res, next) {
	fs.readdir(stepUtil.uploadDir, (err, files) => {
		if (err) throw err;
		res.status(200).json(files);
	});
});

/* GET mapped json of current files */
router.get('/json', function (req, res, next) {
	const q = url.parse(req.url, true).query;


	const fileName = q.fileName;
	const assemblyStructure = stepUtil.buildJSON(fileName);


	res.status(200).json(assemblyStructure);

});

/* DELETE current files */
router.delete('/', function (req, res, next) {
	const q = url.parse(req.url, true).query;

	const fileName = q.fileName;

	stepUtil.deleteFiles(fileName);

	res.status(200).json('Relevant files deleted');
});

/* PUT step to rdf */
router.put('/rdf', function (req, res, next) {

	const fileName = req.body.fileName;
	const activeGraph = 'http://' + parseFileName(fileName);
	const repositoryName = req.body.repositoryName;

	const ttlFileContent = stepUtil.buildRDF(fileName);

	GDB_GRAPH.ADD_TO_GRAPH(ttlFileContent, activeGraph, repositoryName).then(function (response) {

		if (response.status == 204) {
			console.log('Updated GDB with ' + 204);
			res.status(200).json('Done!');
		} else {
			console.log(response.data);
		}

	})
		.catch(function (error) {
			res.status(500).json('Ups something went wrong with the GDB!');
			console.log(error);
		});
    

});

module.exports = router;

// util functions

function parseFileName(fileName) {
	fileName = fileName.replace(/ /g, "_");
	fileName = fileName.replace(/\\/g, "_");

	return fileName;
}




