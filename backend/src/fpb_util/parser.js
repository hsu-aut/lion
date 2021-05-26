const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');

const rdf = require('./assertionalPatterns')


// create directory if it does not exist
const uploadDir = './temp/fpbjs/uploads';
const rdfDir = './temp/fpbjs/rdf';

fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) throw err;
});
fs.mkdir(rdfDir, { recursive: true }, (err) => {
    if (err) throw err;
});

/**
 * Builds and inserts a .ttl from a fileName such as abc.json that already has been uploaded.
 *
 * @param {String} jsonFileName
 * @returns
 */
function buildRDF(jsonFileName) {

    let jsonFilePath = uploadDir + '/' + jsonFileName;
    let rdfFilePath = rdfDir + '/' + jsonFileName.replace('.json', '.ttl');

    try {
        if (fs.existsSync(rdfFilePath)) {
            let ttlFile = fs.readFileSync(rdfFilePath);
            return ttlFile.toString();
        } else {

            let fpbjsFile = fs.readFileSync(jsonFilePath);
            let fpbjs = JSON.parse(fpbjsFile);

            let processRDF = rdf.mapJsonToRDF(fpbjs);

            fs.writeFileSync(rdfFilePath, processRDF);

            return processRDF;
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
function deleteFiles(jsonFileName) {


    let jsonFilePath = uploadDir + '/' + jsonFileName;
    let rdfFilePath = rdfDir + '/' + jsonFileName.replace('.json', '.ttl');

    // check if file is defined, if not clear complete directory
    if (jsonFileName) {
        
        fs.unlink(jsonFilePath, err => {
            if (err) console.log(err);
            return "File deleted";
        });
        fs.unlink(rdfFilePath, err => {
            if (err) console.log(err);
        });
    } else {
        clearDirectory();
        return "All files deleted";
    }

}


module.exports.buildRDF = buildRDF;
module.exports.deleteFiles = deleteFiles;
module.exports.uploadDir = uploadDir;


function clearDirectory() {
    fs.readdir(uploadDir, (err, files) => {
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