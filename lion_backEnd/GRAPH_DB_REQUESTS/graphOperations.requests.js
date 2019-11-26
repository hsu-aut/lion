const client = require('axios');
var log = require('./GDB_LOG')


/* method to perform a graph operation via HTTP GET to the GRaphDB */
exports.GET_ALL_TRIPLES = function (graph, repositoryName, format) {

    // promise that is returned by them ethod
    var promise = new Promise(function (resolve) {
        var config = {
          method: 'GET',
          headers: {
            'Accept': format
          },
          responseType: 'text',
          baseURL: 'http://localhost:7200/',
          url: `/repositories/${repositoryName}/rdf-graphs/service?graph=${graph}`
        }
        // http call
        client(config).then(function (response) {
          log.GDB_LOG_SUCCESS(response)
          let GDB = {
              status: response.status,
              data: JSON.stringify(response.data)
          }
          resolve(GDB);
        })
        // error handling for graphdb errors
          .catch(function (error) {
            log.GDB_LOG_ERROR(error)
            let GDB = {
                status: error.response.status,
                data: error.response.data
            }
            resolve(GDB);
          });
  
      })
      // server error
        .catch(function (error) {
          console.log(error);
          resolve(error);
        });
  
    return promise
  
  }

  /* method to perform a graph operation via HTTP PUT to the GRaphDB */
exports.SET_GRAPH = function (graph, repositoryName, format, triples) {

    // promise that is returned by them ethod
    var promise = new Promise(function (resolve) {
        var config = {
          method: 'PUT',
          headers: {
            'Content-Type': format
          },
          responseType: 'text',
          data: triples,
          baseURL: 'http://localhost:7200/',
          url: `/repositories/${repositoryName}/rdf-graphs/service?graph=${graph}`
        }
        // http call
        client(config).then(function (response) {
          log.GDB_LOG_SUCCESS(response)
          let GDB = {
              status: response.status,
              data: JSON.stringify(response.data)
          }
          resolve(GDB);
        })
        // error handling for graphdb errors
          .catch(function (error) {
            log.GDB_LOG_ERROR(error)
            let GDB = {
                status: error.response.status,
                data: error.response.data
            }
            resolve(GDB);
          });
  
      })
      // server error
        .catch(function (error) {
          console.log(error);
          resolve(error);
        });
  
    return promise
  
  }

    /* method to perform a graph operation via HTTP PUT to the GRaphDB */
exports.DELETE_GRAPH = function (graph, repositoryName) {

    // promise that is returned by them ethod
    var promise = new Promise(function (resolve) {
        var config = {
          method: 'DELETE',
          responseType: 'text',
          baseURL: 'http://localhost:7200/',
          url: `/repositories/${repositoryName}/rdf-graphs/service?graph=${graph}`
        }
        // http call
        client(config).then(function (response) {
          log.GDB_LOG_SUCCESS(response)
          let GDB = {
              status: response.status,
              data: JSON.stringify(response.data)
          }
          resolve(GDB);
        })
        // error handling for graphdb errors
          .catch(function (error) {
            log.GDB_LOG_ERROR(error)
            let GDB = {
                status: error.response.status,
                data: error.response.data
            }
            resolve(GDB);
          });
  
      })
      // server error
        .catch(function (error) {
          console.log(error);
          resolve(error);
        });
  
    return promise
  
  }