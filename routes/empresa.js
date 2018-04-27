const app = require('express').Router();
const path = require('path');
const shared = require('./shared');
//api auth middleware
app.use(function (req, res, next) {
    //todo impl
    next()
});

app.post('/store', function (req, res, next) {
    res.json({})
});
app.get('/store', function (req, res, next) {
    res.json({})
});

module.exports = app;