const client = require('axios');

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