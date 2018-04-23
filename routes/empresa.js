const app = require('express').Router();
const path = require('path');

//api auth middleware
app.use( function (req, res, next) {
    //todo impl
    next()
});

app.post('/api/store', function (req, res, next) {
    res.json({})
});
app.get('api/store', function (req, res, next) {
    res.json({})
});

module.exports = app;