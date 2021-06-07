var timeStamp = require('../public/javascripts/timestamp');

exports.GDB_LOG_SUCCESS = function (response) {
    console.log('Received a ' + response.status + ' at ' + timeStamp.newTimeStamp())
}

exports.GDB_LOG_ERROR = function (error) {
    console.log('----------- GRAPH DB ERROR -----------')
    console.log(timeStamp)
    console.log('Status code: ' + error.response.status)
    console.log(error.response.data)
}