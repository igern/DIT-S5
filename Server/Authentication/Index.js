var config = require('./auth-config.json');

module.exports = Object.freeze({
    Secret: config.secret 
});