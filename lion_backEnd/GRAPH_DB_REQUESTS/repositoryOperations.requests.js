const client = require('axios');


/* method to get a list of repositories via HTTP GET from the GRaphDB */
exports.GET_REPOSITORIES = function () {


  var promise = new Promise(function (resolve) {

    var config = {
      method: 'GET',
      headers: {
        'Accept': 'application/sparql-results+json, */*;q=0.5'
      },
      baseURL: 'http://localhost:7200/',
      url: `/repositories`
    }

    client(config).then(function (response) {
      console.log("Got a response from GraphDB");
      let GDB = {
          status: response.status,
          data: JSON.stringify(response.data)
      }
      resolve(GDB);
    })
      .catch(function (error) {
        console.log("Got an error from GraphDB");
        let GDB = {
            status: error.response.status,
            data: error.response.data
        }
        console.log(error);
        console.log(GDB)
        resolve(GDB);
      });

  });
  return promise

}

/* method to clear a repository via HTTP DELETE in the GRaphDB */
exports.CLEAR_REPOSITORY = function (repositoryName) {


    var promise = new Promise(function (resolve) {
  
      var config = {
        method: 'DELETE',
        baseURL: 'http://localhost:7200/',
        url: `/repositories/${repositoryName}/statements`
      }
  
      client(config).then(function (response) {
        console.log("Got a response from GraphDB");
        let GDB = {
            status: response.status,
            data: JSON.stringify(response.data)
        }
        resolve(GDB);
      })
        .catch(function (error) {
          console.log("Got an error from GraphDB");
          let GDB = {
              status: error.response.status,
              data: error.response.data
          }
          console.log(error);
          console.log(GDB)
          resolve(GDB);
        });
  
    });
    return promise
  
  }