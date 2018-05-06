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
const elasticsearch = require('elasticsearch');
const config = require('./appConfig');

const app = express();

app.set("env", "development");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(timeout('60s'));
app.use(compression({}));
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

const elasticClient = new elasticsearch.Client({
    host: config.elastic.host
});

app.use(function (req, res, next) {
    req.elasticClient = elasticClient;
    next()
});
app.use('/api/*', function (req, res, next) {
    //disable cache
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (req.session.token) {

    }
    next();
});

//todo create  mock endpionts
app.use('/api', require("./routes/shared"));
app.use('/api/user', require("./routes/client"));
app.use('/api/enterprise', require("./routes/empresa"));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    //forward to error handler
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    let status = res.status() !== 200 ? 200 : 500;
    let code = err.code || 500;
    if (req.timeout) {
        status = 503;
        code = 503
    }
    res.status(status);
    console.error(err);
    console.error(err.stack);
    let message = config.messages[code] || config.messages[500];
    res.json({
        status: false,
        message: message,
    });
});

module.exports = app;
