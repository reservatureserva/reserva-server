const crypto = require('crypto');
const config = require('./appConfig');
const oi = require('mongodb').ObjectId;


class StatusError extends Error {
    constructor(status) {
        super();
        this.code = status;
    }
}


module.exports = {
    generateToken: function (cb) {
        crypto.randomBytes(config.security.tokenBytes, function (err, buffer) {
            if (err) cb(err);
            cb(null, buffer.toString('hex'));
        });
    },

    hashPassword: function (password) {
        let hash = crypto.createHash(config.security.hashMethod);
        hash.update(password);
        return hash.digest('hex');
    },
    verifyPassword: function (password, stored) {
        return this.hashPassword(password) === stored;
    },

    StatusError: StatusError,
    error: function (nextCb, code) {
        nextCb(new StatusError(code))
    },
    generateId: function () {
        //todo impl
        return new oi().toHexString()
    }
};