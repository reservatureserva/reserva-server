const app = require('express').Router();

app.use('/categorias', function (req, res, next) {
    res.json([{name: ""}])
});

module.exports = app;