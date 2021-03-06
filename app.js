// ======================================================================

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql        = require('mysql');
var dbh          = require('express-myconnection');
var session      = require('express-session')
var nconf        = require('nconf');

// Configuration - Default/Local config, override by central
nconf.argv()
	.env()
	.file('central', '/etc/hits.json')
	.file('home', process.env.HOME + '/.hits.json')
	.file('local', 'config.json')
	.defaults({
		database: {host:'127.0.0.1',
      user: 'root',
      password: 'Dextrose_12',
      port: 3306,
      database: 'key'
		}
	});


console.log(nconf.get('database'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(dbh(mysql, nconf.get('database'), 'single'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================================

// Useful home page
var routes = require('./routes/index');
app.use('/', routes);

// Users - TODO change to /launch ? - LTI Launching services - what the user start with
var lti = require('./routes/lti');
app.use('/lti', lti);

var service = require('./routes/service');
app.use('/service', service);


//console.log(lti);
// ======================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    
    var err = new Error('Not Found');
    err.status = 404;
    next(res);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
