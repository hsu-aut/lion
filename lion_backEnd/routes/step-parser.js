var express = require('express');
var router = express.Router();

const IncomingForm = require('formidable').IncomingForm

/* post a step file */
router.post('/', function (req, res, next) {

    var form = new IncomingForm()

    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path
        console.log(file.path)
    })
    form.on('end', () => {
        res.json()
    })
    form.parse(req)
});

module.exports = router;
