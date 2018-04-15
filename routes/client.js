const app = require('express')();
const path = require('path');

app.post('/api/store', function (req, res, next) {
    res.json({})
});
app.get('api/store', function (req, res, next) {
    res.json({})
});
module.exports = app;