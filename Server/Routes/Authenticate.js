var jwt = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.post('/auth', (req, ress) => {
        (async() => {
            const client = await Database.Pool.connect(); 

            try {
                await client.query(Database.QueryStrings.SelectProfileByUsernameAndPassword, [req.headers.username, req.headers.password], (err, res) => {
                    if(res.rows.length > 0) {
                        var token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 604800, // 604800 -> 1 week
                            data: JSON.stringify(res.rows[0].brugernavn) // role will probably be added here
                        }, 'secret');
                
                        ress.set('Token', token);
                        ress.status(200).send();
                    } else {
                        ress.status(401).send();
                    }
                });
            } catch(err) {
                console.log(err);
            } finally {
                client.release();
            }
        })().catch(e => console.error(e.stack));
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