var mysql                   = require('mysql');
var fileReader              = require('fs');

var db_conf = JSON.parse(fileReader.readFileSync("./databaseConfig.json"));


var pool = mysql.createPool(db_conf);

//establish pool connection with db config and handle errors
  pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})
module.exports = pool;