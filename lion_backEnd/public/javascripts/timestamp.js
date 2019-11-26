var moment = require('moment');

function newTimeStamp(){
return moment().format("YYYY-MM-DD HH:mm:ss")
}

exports.newTimeStamp = newTimeStamp;