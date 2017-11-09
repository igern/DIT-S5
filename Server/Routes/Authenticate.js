var JWT = require('jsonwebtoken');
var Database = require('../Database');
var Auth = require('../Authentication');

module.exports = function(app, db) {
    app.post('/auth', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect(); 

            var Query = client.query(Database.QueryStrings.SelectProfileByUsernameAndPassword, [req.headers.username, req.headers.password]);
            
            Query.then(QueryResult => {
                switch(QueryResult.rows.length) {
                    case 1:
                        var token = JWT.sign({
                            exp: Math.floor(Date.now() / 1000) + 604800, // 604800 -> 1 week
                            data: QueryResult.rows[0].username
                        }, Auth.Secret);

                        res.set('Token', token);
                        res.status(200).send();
                        break;

                    default:
                        res.status(401).send();
                        break;
                }
            }).catch(e => console.error(e.stack));

            client.release();
        })().catch(e => console.error(e.stack));
    });

    app.all('*', (req, res, next) => {
        if(req.url == '/profile' && req.method == 'PUT') {
            next();
        } else {
            var token = req.headers.token;
            
            JWT.verify(token, Auth.Secret, function(err, decoded) {
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
        }
    });
};