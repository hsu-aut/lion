var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

const frontendFolder = 'frontend'
var queries = require('./routes/queries');
var graphs = require('./routes/graphs');
var eclassSearch = require('./routes/eclass-search');
const opcUaRouter = require('./routes/opc-ua');
var REPOS = require('./routes/repositories');
var stepMapping = require('./routes/step');
var fpbMapping = require('./routes/fpb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/lion_BE/eclassSearch', eclassSearch);
app.use('/lion_BE/repositories', REPOS);
app.use('/lion_BE/graphs', graphs);
app.use('/lion_BE/queries', queries);
app.use('/lion_BE/opc-ua', opcUaRouter);
app.use('/lion_BE/step', stepMapping);
app.use('/lion_BE/fpb', fpbMapping);

app.get('*.*', express.static(frontendFolder, {maxAge: "1y"}))
app.all('/*', function (req, res) {
  res.status(200).sendFile('/', {root: frontendFolder})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
