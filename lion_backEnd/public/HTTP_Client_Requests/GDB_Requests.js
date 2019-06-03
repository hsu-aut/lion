const client = require('axios');

function getTox(pattern) {
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
    default: {
      // no default statements
      break;
    }
  }

  return client.get(url);

}

exports.insertTBOX = function (pattern, repositoryName) {
  var promise = new Promise(function (resolve) {
    getTox(pattern).then(function (response) {

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
        console.log("Got a response from GraphDB ");
        console.log(response.status);
        resolve(response.status);
      })
        .catch(function (error) {
          reject(error);
          console.log(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        return error
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
      console.log("Got a response from GraphDB " + response.status);
      resolve(response);
    })
      .catch(function (error) {
        reject(error);
        console.log(error);
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
        console.log("Got a response from GraphDB " + response.status);
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
          console.log(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        return error
      });


  });
  return promise

}

exports.clearRepository = function (repositoryName) {


  var promise = new Promise(function (resolve) {

    var config = {
      method: 'DELETE',
      baseURL: 'http://localhost:7200/',
      url: `/repositories/${repositoryName}/statements`
    }

    client(config).then(function (response) {
      console.log("Got a response from GraphDB " + response.status);
      resolve(response);
    })
      .catch(function (error) {
        reject(error);
        console.log(error);
      });

  });
  return promise

}


function deleteTBox(repositoryName){
  var pattern = "VDI3682";
  var promise = new Promise(function (resolve) {
    getTox(pattern).then(function (response) {

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
        console.log("Got a response from GraphDB ");
        console.log(response);

        
        resolve(response);
      })
        .catch(function (error) {
          console.log(error);
        });

    })
      .catch(function (error) {
        console.log(error);
        return error
      });


  });
  return promise
}

var TBOX_URLs = {
  VDI3682: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%203682/VDI3682.owl",
  VDI2206: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/VDI%202206/VDI2206.owl",
  ISA88: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/ISA%2088/ISA88.owl",
  DINEN61360: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/DIN%20EN%2061360/DINEN61360.owl",
  WADL: "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/master/WADL/WADL.owl"
};