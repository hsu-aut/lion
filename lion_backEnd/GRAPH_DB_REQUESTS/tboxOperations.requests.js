const client = require('axios');
var log = require('./GDB_LOG')


exports.insertTBOX = function (pattern, repositoryName) {
  var promise = new Promise(function (resolve) {
    getTBox(pattern).then(function (response) {

      var config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/rdf+xml',
          'Accept': '*/*'
        },
        responseType: 'text',
        data: response.data,
        baseURL: 'http://localhost:7200/',
        url: `/repositories/${repositoryName}/statements`
      }

      client(config).then(function (response) {
        log.GDB_LOG_SUCCESS(response)
        console.log(response.status);
        resolve(response.status);
      })
        .catch(function (error) {
          log.GDB_LOG_ERROR(error)
          resolve(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        resolve(error);
      });


  });
  return promise

}

exports.getAllTriples = function (repositoryName) {


  var promise = new Promise(function (resolve) {

    var config = {
      method: 'GET',
      headers: {
        'Accept': 'application/rdf+xml'
      },
      baseURL: 'http://localhost:7200/',
      url: `/repositories/${repositoryName}/statements`
    }

    client(config).then(function (response) {
      log.GDB_LOG_SUCCESS(response)
      resolve(response);
    })
      .catch(function (error) {
        log.GDB_LOG_ERROR(error)
        resolve(response);
      });

  });
  return promise

}

exports.getAllTriples_W_O_TBox = function (repositoryName) {
  var promise = new Promise(function (resolve) {
    deleteTBox(repositoryName).then(function (response) {

      var config = {
        method: 'GET',
        headers: {
          'Accept': 'application/rdf+xml'
        },
        baseURL: 'http://localhost:7200/',
        url: `/repositories/${repositoryName}/statements`
      }
  
      client(config).then(function (response) {
        log.GDB_LOG_SUCCESS(response)
        resolve(response);
      })
        .catch(function (error) {
          log.GDB_LOG_ERROR(error)
          resolve(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        resolve(error);
      });

  });
  return promise

}

function deleteTBox(repositoryName){
  var pattern = "VDI3682";
  var promise = new Promise(function (resolve) {
    getTBox(pattern).then(function (response) {

      var config = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/rdf+xml',
          'Accept': '*/*'
        },
        responseType: 'text',
        data: response.data,
        baseURL: 'http://localhost:7200/',
        url: `/repositories/${repositoryName}/statements`
      }

      client(config).then(function (response) {
        log.GDB_LOG_SUCCESS(response)     
        resolve(response);
      })
        .catch(function (error) {
          log.GDB_LOG_ERROR(error)
          resolve(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        return error
      });


  });
  return promise
}

function getTBox(pattern) {
    var url;
    switch (pattern) {
      case "VDI3682": {
        url = TBOX_URLs.VDI3682;
        break;
      }
      case "VDI2206": {
        url = TBOX_URLs.VDI2206;
        break;
      }
      case "DINEN61360": {
        url = TBOX_URLs.DINEN61360;
        break;
      }
      case "ISA88": {
        url = TBOX_URLs.ISA88;
        break;
      }
      case "WADL": {
        url = TBOX_URLs.WADL;
        break;
      }
      case "ISO22400_2": {
        url = TBOX_URLs.ISO22400_2;
        break;
      }
      case "OPCUA": {
        url = TBOX_URLs.OPCUA;
        break;
      }
      default: {
        // no default statements
        break;
      }
    }
    return client.get(url);
  }

var TBOX_URLs = {
  VDI3682: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%203682/VDI3682.owl",
  VDI2206: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%202206/VDI2206.owl",
  ISA88: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/ISA%2088/ISA88.owl",
  DINEN61360: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/DIN%20EN%2061360/DINEN61360.owl",
  WADL: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/WADL/WADL.owl",
  ISO22400_2: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/ISO%2022400-2/ISO22400-2.owl",
  OPCUA: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/OPC%20UA/OpcUa.owl"
};