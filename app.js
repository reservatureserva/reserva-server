const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const timeout = require('connect-timeout');
const compression = require('compression');

const app = express();

app.set("env", "dist");
// app.set("env", "development");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(timeout('30s'));

app.use(compression());
// uncomment after placing your favicon in /static
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"}));
app.use(cookieParser());
app.use(session({
    secret: "hgfdbrmc0d67a4dg6a1akc86njktk877olrndoiigg3lzlhfb18bkyds4e49m",
    resave: false,
    cookie: {maxAge: 60000},
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('api/*', function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//todo create  mock endpionts
app.use('api/user', require("./routes/client"));
app.use('api/enterprise', require("./routes/empresa"));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.locals.message = 'Page Not Found';
    res.locals.error = err;
    res.locals.env = req.app.get('env');

    //forward to error handler
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    res.locals.env = req.app.get('env');
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
