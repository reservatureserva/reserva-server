const app = require('express').Router();
const UserController = require('../controllers/users');

//api auth middleware
app.use(function (req, res, next) {
    if (!['/register', '/login', '/logout'].includes(req.path) && !UserController.validateToken(req)) {
        //require autentificacion
        utils.error(next, 'EAUTH')
    } else {
        next()
    }
});
new UserController(UserController.TYPE_CLIENT).mount(app);

module.exports = app;