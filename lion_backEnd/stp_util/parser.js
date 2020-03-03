const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');

const rdf = require('./assertionalPatterns')
const StepToJsonParser = require('step-to-json').StepToJsonParser;

// create directory if it does not exist
const uploadDir = './temp/step/uploads';
const jsonDir = './temp/step/json';
const rdfDir = './temp/step/rdf';

fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) throw err;
});
fs.mkdir(jsonDir, { recursive: true }, (err) => {
    if (err) throw err;
});
fs.mkdir(rdfDir, { recursive: true }, (err) => {
    if (err) throw err;
});

/**
 * Returns a .json from a fileName such as abc.stp that already has been uploaded.
 *
 * @param {String} stepFileName
 * @returns
 */
function buildJSON(stepFileName) {

    let stepFilePath = uploadDir + '/' + stepFileName;
    let jsonFilePath = jsonDir + '/' + stepFileName.replace('.stp', '.json');

    try {
        if (fs.existsSync(jsonFilePath) && fs.existsSync(stepFilePath)) {

            let jsonFile = fs.readFileSync(jsonFilePath);
            return JSON.parse(jsonFile);

        } else {

            let stepFile = fs.readFileSync(stepFilePath);
            let parser = new StepToJsonParser(stepFile);

            let assemblyStructure = parser.parse();
            assemblyStructure = createUniqueIds(assemblyStructure);
            assemblyStructure = parseName(assemblyStructure);

            let fileData = JSON.stringify(assemblyStructure);

            fs.writeFileSync(jsonFilePath, fileData);

            return assemblyStructure
        }
    } catch (err) {
        console.error(err)
    }
}

/**
 * Builds and inserts a .ttl from a fileName such as abc.stp that already has been uploaded.
 *
 * @param {String} stepFileName
 * @returns
 */
function buildRDF(stepFileName) {

    let rdfFilePath = rdfDir + '/' + stepFileName.replace('.stp', '.ttl');

    try {
        if (fs.existsSync(rdfFilePath)) {
            let ttlFile = fs.readFileSync(rdfFilePath);
            return ttlFile.toString();
        } else {

            let assemblyStructure = buildJSON(stepFileName);
            let assemblyRDF = rdf.mapJsonToRDF(assemblyStructure);

            fs.writeFileSync(rdfFilePath, assemblyRDF);

            return assemblyRDF;
        }
    } catch (error) {
        console.error(error)
    }

}

/**
 * Deletes the file named as a parameter. If no file submitted, all files will be deleted
 *
 * @param {String} fileName
 * @returns StatusString
 */
function deleteFiles(stepFileName) {

    let stepFilePath = uploadDir + '/' + stepFileName;
    let jsonFilePath = jsonDir + '/' + stepFileName.replace('.stp', '.json');
    let rdfFilePath = rdfDir + '/' + stepFileName.replace('.stp', '.ttl');

    // check if file is defined, if not clear complete directory
    if (stepFileName) {
        
        fs.unlink(stepFilePath, err => {
            if (err) console.log(err);
            return "File deleted";
        });
        fs.unlink(jsonFilePath, err => {
            if (err) console.log(err);
        });
        fs.unlink(rdfFilePath, err => {
            if (err) console.log(err);
        });
    } else {
        clearDirectory();
        return "All files deleted";
    }

}

// exported functions
module.exports.uploadDir = uploadDir;
module.exports.buildRDF = buildRDF;
module.exports.buildJSON = buildJSON;
module.exports.deleteFiles = deleteFiles;




// util functions
function createUniqueIds(stepJson) {

    stepJson.id = uuid();

    if (stepJson.contains.length != 0) {
        stepJson.contains.forEach(element => {
            createUniqueIds(element);
        });
    }
    return stepJson
}

function parseName(stepJson) {

    stepJson.name = stepJson.name.replace(/ /g, "_");
    stepJson.name = stepJson.name.replace(/\\/g, "_");

    if (stepJson.contains.length != 0) {
        stepJson.contains.forEach(element => {
            parseName(element);
        });
    }
    return stepJson

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

    fs.readdir(jsonDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {
                if (err) throw err;
            });
        }
    });

    fs.readdir(rdfDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {
                if (err) throw err;
            });
        }
    });
}