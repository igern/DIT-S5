var Token = require('../Token');
var Database = require('../Database');

module.exports = function(app, db) {
    app.post('/auth', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect(); 

            client.query(Database.QueryStrings.SelectProfileByUsernameAndPassword, [req.headers.username, req.headers.password])
            .then(QueryResult => {
                switch(QueryResult.rows.length) {
                    case 1:
                        res.set('Token', Token.New({
                            exp: Math.floor(Date.now() / 1000) + 604800, // 604800 -> 1 week
                            data: QueryResult.rows[0].email
                        }));

                        res.status(200).send();
                        break;

                    default:
                        res.status(401).send();
                        break;
                }
            }).catch((e) => { 
                console.error(e)
            });

            client.release();
        })().catch((e) => { });
    });

    app.get('/auth', (req, res) => {
        (async() => {
            switch(Token.Verify(req.headers.token)) {
                case 'valid':
                    res.status(200).send();
                    break;

                default:
                    res.status(400).send();
                    break;
            }
        })().catch((e) => { console.error(e); });
    });

    app.all('*', (req, res, next) => {
        (async() => {
            if(req.url == '/profile' && req.method == 'PUT') {
                next();
            } else {
                switch(Token.Verify(req.headers.token)) {
                    case 'valid':
                        next();
                        break;

                    case 'expired':
                        res.status(401).send('Token expired!');
                        break;

                    case 'malformed':
                        res.status(400).send('Malformed token!');
                        break;

                    default:
                        res.status(400).send('Unknown error encountered!');
                        break;
                }
            }
        })().catch((e) => { console.error(e); });
    });
};