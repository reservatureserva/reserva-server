const app = require('express').Router();
const path = require('path');
const shared = require('./shared');


app.get('categorias', function (res, req, next) {

    res.json([{name: ""}])
});

module.exports = app;