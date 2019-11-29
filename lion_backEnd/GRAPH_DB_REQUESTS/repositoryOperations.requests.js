const client = require('axios');
var log = require('./GDB_LOG')


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
      log.GDB_LOG_SUCCESS(response)
      let GDB = {
        status: response.status,
        data: JSON.stringify(response.data)
      }
      resolve(GDB);
    })
      .catch(function (error) {
        log.GDB_LOG_ERROR(error)
        let GDB = {
          status: error.response.status,
          data: error.response.data
        }
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
      log.GDB_LOG_SUCCESS(response)
      let GDB = {
        status: response.status,
        data: JSON.stringify(response.data)
      }
      resolve(GDB);
    })
      .catch(function (error) {
        log.GDB_LOG_ERROR(error)
        let GDB = {
          status: error.response.status,
          data: error.response.data
        }
        resolve(GDB);
      });

  });
  return promise
}

/* method to delete a repository via HTTP DELETE in the GRaphDB */
exports.DELETE_REPOSITORY = function (repositoryName) {


  var promise = new Promise(function (resolve) {

    var config = {
      method: 'DELETE',
      baseURL: 'http://localhost:7200/',
      url: `/repositories/${repositoryName}`
    }

    client(config).then(function (response) {
      log.GDB_LOG_SUCCESS(response)
      let GDB = {
        status: response.status,
        data: JSON.stringify(response.data)
      }
      resolve(GDB);
    })
      .catch(function (error) {
        log.GDB_LOG_ERROR(error)
        let GDB = {
          status: error.response.status,
          data: error.response.data
        }
        resolve(GDB);
      });

  });
  return promise
}