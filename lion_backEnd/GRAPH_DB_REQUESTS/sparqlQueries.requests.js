const client = require('axios');
var log = require('./GDB_LOG')


/* method to perform a SPARQL SELECT via HTTP POST to the GRaphDB */
exports.SAPRQL_SELECT = function (query, repositoryName) {

    // promise that is returned by them ethod
    var promise = new Promise(function (resolve) {
        var config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-query'
          },
          responseType: 'text',
          data: query,
          baseURL: 'http://localhost:7200/',
          url: `/repositories/${repositoryName}`
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

/* method to perform a SPARQL SELECT via HTTP POST to the GRaphDB */
exports.SAPRQL_UPDATE = function (query, repositoryName) {

  // promise that is returned by them ethod
  var promise = new Promise(function (resolve) {
      var config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-update',
          'Accept': 'application/rdf+xml, */*;q=0.5'
        },
        responseType: 'text',
        data: query,
        baseURL: 'http://localhost:7200/',
        url: `/repositories/${repositoryName}/statements`
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