var JWT = require('jsonwebtoken');
var config = require('./auth-config.json');

module.exports = Object.freeze({
    Secret: config.secret,

    New: function(exp, data) {
        return JWT.sign({
            exp: Object.values(exp)[0], 
            data: Object.values(exp)[1]
        }, config.secret);
    },

    Verify: function(token) {
        var result = 'unknown';

        JWT.verify(token, config.secret, function(err, decoded) {
            if(err) {
                if(err.name == 'TokenExpiredError') {
                    result = 'expired';
                } else if (err.name == 'JsonWebTokenError') {
                    result = 'malformed';
                }
            } else {
                result = 'valid';
            }
        })

        return result;
    },

    ReadData: function(token) {
        var decoded = JWT.decode(token, {complete: true});
        return decoded.payload.data;
    },
});