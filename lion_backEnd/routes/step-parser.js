var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');

const path = require('path');
const IncomingForm = require('formidable').IncomingForm

const GDB_QUERY = require('../GRAPH_DB_REQUESTS/sparqlQueries.requests')
const StepToJsonParser = require('step-to-json').StepToJsonParser;

// create directory if it does not exist
var uploadDir = './temp/step/uploads';
fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) throw err;
});


/* post a step file and store it locally */
router.post('/', function (req, res, next) {

    var form = new IncomingForm()
    form.uploadDir = uploadDir;

    form.on('file', (field, file) => {
        fs.renameSync(file.path, uploadDir + "/" + file.name)
    })
    form.on('end', () => {
        res.status(200).json('Added file')
    })
    form.parse(req)
});

/* GET list of current files */
router.get('/', function (req, res, next) {
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        res.status(200).json(files);
    });
});

/* GET mapped json of current files */
router.get('/tojson', function (req, res, next) {
    const q = url.parse(req.url, true).query;


    let fileName = q.fileName;
    let filePath = uploadDir + '/' + fileName;

    const stepFile = fs.readFileSync(filePath);
    const parser = new StepToJsonParser(stepFile);

    const assemblyStructure = parser.parse();
    res.status(200).json(assemblyStructure);

});

/* DELETE current files */
router.delete('/', function (req, res, next) {
    const q = url.parse(req.url, true).query;

    let fileName = q.fileName;

    if (fileName) {
        fs.unlink(path.join(uploadDir, fileName), err => {
            if (err) throw err;
            res.status(200).json('File deleted');
        });
    } else {
        clearDirectory();
        res.status(200).json('All files deleted');
    }
});

/* PUT step to rdf */
router.put('/tordf', function (req, res, next) {
    const q = url.parse(req.url, true).query;

    let fileName = q.fileName;
    let filePath = uploadDir + '/' + fileName;

    // let activeGraph = q.activeGraph;
    let activeGraph = "http://stepJson"
    let repositoryName = q.repositoryName;

    const stepFile = fs.readFileSync(filePath);
    const parser = new StepToJsonParser(stepFile);
    const assemblyStructure = parser.parse();

    mapJsonToRDF(assemblyStructure,activeGraph,repositoryName)

    res.status(200).json('Done');

});

module.exports = router;


function createSystemContainsSystem(System, SubSystem, activeGraph, repositoryName) {

    System = 'http://lionFacts/' + System
    SubSystem = 'http://lionFacts/' + SubSystem

    var insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
    INSERT { 
      GRAPH <${activeGraph}>{
        ?System a VDI2206:System.
        ?System VDI2206:SystemConsistsOfSystem ?SubSystem.       
        ?SubSystem a VDI2206:System.}
    } WHERE {
        BIND(IRI(STR("${System}")) AS ?System).
        BIND(IRI(STR("${SubSystem}")) AS ?SubSystem).
    }`;

    console.log(insertString)

    GDB_QUERY.SAPRQL_UPDATE(insertString, repositoryName).then(function (response) {

        if (response.status == 204) {
            console.log('Updated GDB with ' + 204);
        } else {
            console.log(response.data)
        }

    })
        .catch(function (error) {
            console.log(error);
        });
}

function createSystemContainsComponent(System, Component, activeGraph, repositoryName) {

    System = 'http://lionFacts/' + System
    Component = 'http://lionFacts/' + Component

    var insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
    INSERT { 
      GRAPH <${activeGraph}>{
        ?System a VDI2206:System.
        ?System VDI2206:SystemConsistsOfComponent ?Component.       
        ?Component a VDI2206:Component.}
    } WHERE {
        BIND(IRI(STR("${System}")) AS ?System).
        BIND(IRI(STR("${Component}")) AS ?Component).
    }`;

    console.log(insertString)

    GDB_QUERY.SAPRQL_UPDATE(insertString, repositoryName).then(function (response) {

        if (response.status == 204) {
            console.log('Updated GDB with ' + 204);
        } else {
            console.log(response.data)
        }

    })
        .catch(function (error) {
            console.log(error);
        });
}

function createComponent(Component, activeGraph, repositoryName) {

    Component = 'http://lionFacts/' + Component

    var insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
    INSERT { 
      GRAPH <${activeGraph}>{      
        ?Component a VDI2206:Component.}
    } WHERE {
        BIND(IRI(STR("${Component}")) AS ?Component).
    }`;

    console.log(insertString)

    GDB_QUERY.SAPRQL_UPDATE(insertString, repositoryName).then(function (response) {

        if (response.status == 204) {
            console.log('Updated GDB with ' + 204);
        } else {
            console.log(response.data)
        }

    })
        .catch(function (error) {
            console.log(error);
        });
}

function clearDirectory() {
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {
                if (err) throw err;
            });
        }
    });
}


function mapJsonToRDF(stepObject, activeGraph, repository) {

    var stepObject = stepObject;

    if (stepObject.contains.length == 0) {
        createComponent(createIdentifier(stepObject.id,stepObject.name),activeGraph, repository)
        console.log("create component...")
    } else {
        stepObject.contains.forEach(contained => {
            if (contained.contains.length == 0) {
                createSystemContainsComponent(createIdentifier(stepObject.id,stepObject.name), createIdentifier(contained.id, contained.name), activeGraph, repository)
                console.log(contained.contains.length)
                console.log("create sys contains com ...")
            } else {
                createSystemContainsSystem(createIdentifier(stepObject.id,stepObject.name), createIdentifier(contained.id, contained.name), activeGraph, repository)
                console.log("create sys contains sys ...")
                console.log(createIdentifier(stepObject.id,stepObject.name))
                console.log(createIdentifier(contained.id, contained.name))
                mapJsonToRDF(contained, activeGraph, repository)
            }
        });
    }

}

function createIdentifier(stepID, name){
    name = name.replace(/ /g, "_");
    name = name.replace(/\\/g, "_");

    identifier = stepID + name;

    return identifier
}



