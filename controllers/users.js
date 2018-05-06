const utils = require('../utils');


class UserController {
    constructor(tipo) {
        this.tipo = tipo;
        this.pk = {
            'client': 'dni',
            'empresa': 'cif'
        };
        this.docMap = {
            'client': 'usuarios',
            'empresa': 'empresas'
        };
    }

    mount(route) {
        let vm = this;
        route.post('/register', function (req, res, next) {
            vm.register(req, res, next)
        });
        route.post('/baja', function (req, res, next) {
            vm.baja(req, res, next)
        });
        route.get('/profile', function (req, res, next) {
            vm.profile(req, res, next)
        });
        route.post('/edit', function (req, res, next) {
            vm.edit(req, res, next)
        });
        route.post('/login', function (req, res, next) {
            vm.login(req, res, next)
        });
        route.use('/logout', function (req, res, next) {
            vm.logout(req, res, next)
        })
    }

    profile(req, res, next) {
        res.json({data: {}})
    }

    login(req, res, next) {
        let vm = this;
        let client = req.elasticClient;
        let term = {};
        term[this.pk[this.tipo]] = this.pk[this.tipo];
        client.search({
                index: this.docMap[this.tipo],
                type: this.docMap[this.tipo],
                size: 1,
                body: {
                    query: {
                        bool: {
                            must: {
                                term: term
                            }
                        }
                    }
                }
            }, function (e, r) {
                if (e) {
                    utils.error(next, 500)
                } else {
                    if (r.hits.hits.length) {
                        let doc = r.hits.hits[0];
                        if (utils.verifyPassword(req.body.password, doc.password)) {
                            vm.setLogin(req, res);
                        } else {
                            utils.error(next, 401)
                        }
                    } else {
                        utils.error(next, 401)
                    }
                }
            }
        );
    }

    setLogin(req, res) {
        utils.generateToken(function (e, t) {
            req.session.regenerate(function (e) {
                req.session.token = t;
                res.json({
                    status: true,
                    data: [],
                    code: 200
                })
            });
        });
    }

    logout(req, res, next) {
        req.session.destroy(function (err) {
            res.json({data: {}})
        });
    }

    register(req, res, next) {
        if (!(req.body.password && req.body[this.pk[this.tipo]])) utils.error(next, 500);
        else {
            let vm = this;
            let client = req.elasticClient;
            let term = {};
            term[this.pk[this.tipo]] = this.pk[this.tipo];
            let element = this.docMap[this.tipo];

            client.search({
                    index: element,
                    type: element,
                    size: 1,
                    body: {
                        query: {
                            bool: {
                                must: {
                                    term: term
                                }
                            }
                        }
                    }
                }, function (e, r) {
                    if (e) {
                        utils.error(next, 500)
                    } else {
                        if (r && !r.hits.hits.length) {
                            //todo normalize & valiate inputs

                            req.body.password = utils.hashPassword(req.body.password);
                            client.create({
                                index: element,
                                type: element,
                                id: utils.generateId(),
                                body: req.body
                            }, function (e, r) {
                                if (e) {
                                    console.error(e, e.stack);
                                    utils.error(next, "ERegister")
                                }
                                else vm.setLogin(req, res)
                            })
                        } else {
                            utils.error(next, 401)
                        }
                    }
                }
            );
        }
    }

    baja(req, res, next) {
        res.json({})
    }

    static validateToken(req) {
        //todo mejorar con llamadas a la collecion auth
        return req.session.token && req.session.token.length === 48
    }

    edit(req, res, next) {
        if (UserController.validateToken(req) && req.body.id) {
            let client = req.elasticClient;
            let element = this.docMap[this.tipo];
            client.update({
                index: element,
                type: element,
                id: req.body.id,
                body: {
                    //todo validar el cuerpo de la peticion
                    doc: req.body
                }
            }, function (error, response) {
                if (error) utils.error(next, 500);
                else res.json({status: true, data: req.body})
            })
        }
    }
}

UserController.TYPE_CLIENT = 'client';
UserController.TYPE_EMPRESA = 'empresa';

module.exports = UserController;