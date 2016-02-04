var express = require('express');
var path = require('path');
var multer = require('multer');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');
var i18n = require('i18n');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs  = require('hbs');
var app = express();

var routes = require('./routes/index');
var users = require('./routes/user');

i18n.configure({
  locales: ['es', 'en'],
  cookie: 'locale',
  directory: __dirname + "/locales"
});

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.engine('hbs', hbs.__express);
hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper("ifvalue", function(conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

if (app.get('env') === 'development') {
  app.set('views', path.join(__dirname, 'views'));
}
else {
  app.set('views', path.join(__dirname, 'views/dst'));
}
app.set('view engine', 'hbs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'),{ maxAge: 86400000 }));
app.use(multer({dest: './public/uploads/'}));
app.use(i18n.init);
app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
