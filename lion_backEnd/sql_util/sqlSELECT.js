var sqlPool                 = require('./sqlDBConnector');
var fileReader              = require('fs');

var db_conf = JSON.parse(fileReader.readFileSync("./databaseConfig.json"));


exports.selectEclassProperties = function (propertyName){

var selectString = `
SELECT p.Identifier, p.VersionNumber, p.RevisionNumber, p.PreferredName, p.ShortName, p.Definition, p.DataType, uom.DINNotation 

FROM eclass_basic_9_1_properties.eclass9_1_pr_de AS p

LEFT OUTER JOIN eclass_basic_9_1_properties.eclass9_1_un_de AS uom ON p.IrdiUN = uom.IrdiUN

WHERE PreferredName LIKE '%${propertyName}%';`;

var promise = new Promise(function(resolve) {
    // do a thing, possibly async, then…
    sqlPool.query(selectString, function (err, results, fields){
        if(err) reject(err);
        console.log("SQL executed...");
        // resolve 
        resolve(results);
    });
  });

  return promise

// sqlPool.query(selectString, function (err, results, fields){
//     if(err) throw err;
//     console.log("results");
//     return results;
// });

}

