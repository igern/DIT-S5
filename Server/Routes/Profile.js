var Token = require('../Token');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                if(req.headers.email == undefined) {
                    resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [Token.ReadData(req.headers.token)]));
                } else {
                    resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [req.headers.email]));
                }
            }).then((result) => {
                res.set('Profile', JSON.stringify([result.rows[0].username, result.rows[0].role, result.rows[0].avatar]));
                res.status(200).send();
            }).catch((e) => {
                console.error(e);
            });

            client.release();
        })().catch((e) => { });
    });

    app.put('/profile', (req, res, next) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [req.headers.username]));
            }).then((result) => {
                if(result.rows.length == 0) {
                    return client.query(Database.QueryStrings.SelectProfileByEmail, [req.headers.email]);
                } else {
                    res.status(409).send();
                    return Promise.reject("Username is already taken!");
                }
            }).then((result) => {
                if(result.rows.length == 0) {
                    client.query(Database.QueryStrings.InsertProfile, [req.headers.username, req.headers.password, req.headers.email]);
                } else {
                    res.status(400);
                    return Promise.reject("Email is already taken!");
                }
            }).then((result) => {
                res.status(200).send();
            }).catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });

    app.post('/profile', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.profile);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.UpdateProfile, [Data[0], Data[1], Data[2], Data[3]]));
            }).then((result) => {
                res.status(200).send();
            }).catch((e) => {
                console.error(e)
            });
            
            client.release();
        })().catch((e) => { });
    });

    app.delete('/profile', (req, res) => {
        (async() => {
            var token_email = Token.ReadData(req.headers.token);
            var target_email = null;
            var token_role = null, target_role = null;
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [req.headers.username]));
            })
            .then((result) => { 
                if(result.rows.length == 0) {
                    res.status(409).send();
                    return Promise.reject("Target user doesn't exist!");
                } else {
                    target_email = result.rows[0].email;
                }
            })
            .then((result) => {
                if(token_email == target_email) {
                    client.query(Database.QueryStrings.DeleteProfile, [target_email]);
                    res.status(200).send();
                    return Promise.reject("User has been deleted! Token username and target usernames matched.");
                } 
            })
            .then((result) => {
                return client.query(Database.QueryStrings.SelectProfileByEmail, [token_email]);
            })
            .then((result) => {
                if(result.rows[0].role == 'admin') {
                    client.query(Database.QueryStrings.DeleteProfile, [target_email]);
                    res.status(200).send();
                    return Promise.reject("User has been deleted! Token bearer had admin rights!");
                }
            })
            .then((result) => {
                res.status(400).send();
                return Promise.reject("Unknown error encountered!");
            }).catch((e) => {
                console.error(e);
            });

            client.release();
        })().catch((e) => { });
    });
};