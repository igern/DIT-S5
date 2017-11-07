var jwt = require('jsonwebtoken');

module.exports = function(app, db) {
    app.post('/auth', (req, ress) => {
        (async() => {
            
            const text = "SELECT * FROM profile WHERE brugernavn=$1 AND kodeord=$2";
            const values = [req.headers.username, req.headers.password];
    
            const client = await global.database.connect();

            try {
                await client.query(text, values, (err, res) => {
                    if(err) {
                        console.log(err.stack);
                    } else {
                        if(res.rows.length > 0) {
                            var token = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + 604800, // 604800 -> 1 week
                                data: JSON.stringify(res.rows[0].brugernavn) // role will probably be added here
                            }, 'secret');
                    
                            ress.set('Response', token);
                            ress.status(200).send();
                        } else {
                            ress.set('Response', '');
                            ress.status(401).send();
                        }
                    }
                });
            } catch(e) {
                throw e;
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