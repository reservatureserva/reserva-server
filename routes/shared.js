const app = require('express').Router();

app.use('/categorias', function (req, res, next) {
    res.json([{name: ""}])
});

app.get('/profile',function (req, res, next) {
    switch (app.mountpath){

    }
});

module.exports = app;