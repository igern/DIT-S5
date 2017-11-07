var jwt = require('jsonwebtoken');

module.exports = function(app, db) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/auth', (req, res) => {
        var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 604800, // 604800 -> 1 week
            data: '123'
        }, 'secret');

        res.send(token);
    });

    app.all('*', (req, res, next) => {
        var token = req.headers.token;
        
        jwt.verify(token, 'secret', function(err, decoded) {
            if(err) {
                switch(err.name) {
                    case 'TokenExpiredError':
                        res.status(401).send('Token expired!');
                        break;

                    case 'JsonWebTokenError':
                        res.status(400).send('Malformed token!');
                        break;

                    default:
                        res.status(400).send('Unexpected error encountered!');
                        break;
                }
            } else {
                next();
            }
        });
    });
};