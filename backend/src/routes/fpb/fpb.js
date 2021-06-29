// var express = require('express');
// var router = express.Router();
// var fs = require('fs');
// var url = require('url');

// const IncomingForm = require('formidable').IncomingForm;
// const GDB_GRAPH = require('../GRAPH_DB_REQUESTS/graphOperations.requests');
// const fpbUtil = require('../../fpb_util/parser');


// /* GET list of fpbjs files. */
// router.get('/', function (req, res, next) {
// 	fs.readdir(fpbUtil.uploadDir, (err, files) => {
// 		if (err) throw err;
// 		res.status(200).json(files);
// 	});
// });


// /* POST fpbjs file. */
// router.post('/', function (req, res, next) {

// 	var form = new IncomingForm();
// 	form.maxFileSize = 350 * 1024 * 1024;
// 	form.uploadDir = fpbUtil.uploadDir;
// 	console.log(form.uploadDir);

// 	form.on('file', (field, file) => {
// 		fs.renameSync(file.path, fpbUtil.uploadDir + "/" + file.name);
// 	});
// 	form.on('end', () => {
// 		res.status(200).json('Added file');
// 	});
// 	form.parse(req);
// });

// /* DELETE fpbjs files. */
// router.delete('/', function (req, res, next) {
// 	const q = url.parse(req.url, true).query;

// 	const fileName = q.fileName;

// 	fpbUtil.deleteFiles(fileName);

// 	res.status(200).json('Relevant files deleted');
// });

// /* PUT fpbjs file to turtle and update GDB. */
// router.put('/rdf', function (req, res, next) {

// 	const fileName = req.body.fileName;
// 	const activeGraph = 'http://' + parseFileName(fileName);
// 	const repositoryName = req.body.repositoryName;

// 	const ttlFileContent = fpbUtil.buildRDF(fileName);

// 	GDB_GRAPH.ADD_TO_GRAPH(ttlFileContent, activeGraph, repositoryName).then(function (response) {

// 		if (response.status == 204) {
// 			console.log('Updated GDB with ' + 204);
// 			res.status(200).json('Done!');
// 		} else {
// 			console.log(response.data);
// 		}

// 	})
// 		.catch(function (error) {
// 			res.status(500).json('Ups something went wrong with the GDB!');
// 			console.log(error);
// 		});

// });

// module.exports = router;

// // util functions

// function parseFileName(fileName) {
// 	fileName = fileName.replace(/ /g, "_");
// 	fileName = fileName.replace(/\\/g, "_");

// 	return fileName;
// }