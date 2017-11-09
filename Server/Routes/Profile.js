var JWT = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [req.headers.username]));
            })
            .then((result) => {
                res.set('Profile', JSON.stringify([result.rows[0].email, result.rows[0].username, result.rows[0].role, result.rows[0].avatar]));
                res.status(200).send();
            }).catch((e) => {console.error(e);});

            client.release();
        })().catch((e) => {});
    });

    app.put('/profile', (req, res, next) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [req.headers.username]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        return client.query(Database.QueryStrings.SelectProfileByEmail, [req.headers.email]);
                    } else {
                        returnStatus = 409; // Username is already taken.
                    }
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        client.query(Database.QueryStrings.InsertProfile, [req.headers.username, req.headers.password, req.headers.email]);
                    } else {
                        returnStatus = 400; // Email is already taken.
                    }
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            })
            .catch(e => console.error(e));          

            client.release();
        })().catch((e) => {});
    });

    app.post('/profile', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                var Data = JSON.parse(req.headers.profile);
                resolve(client.query(Database.QueryStrings.UpdateProfile, [Data[0], Data[1], Data[2], Data[3]]));
            })
            .then((result) => {
                res.status(200).send();
            }).catch(e => console.error(e));
            
            client.release();
        })().catch((e) => {});
    });

    app.delete('/profile', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = -1;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.
            var target_username = req.headers.username;

            var token_role = null;
            var target_role = null;

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [target_username]));
            })
            .then((result) => { 
                if(returnStatus == -1) {
                    if(result.rows.length == 0) {
                        returnStatus = 409; // Target user doesn't exist.
                    }
                }
            })
            .then((result) => {
                if(returnStatus == -1) {
                    if(token_username == target_username) {
                        returnStatus = 200;
                        client.query(Database.QueryStrings.DeleteProfile, [target_username]);
                    } 
                }
            })
            .then((result) => {
                if(returnStatus == -1) {
                    return client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]);
                }
            })
            .then((result) => {
                if(returnStatus == -1) {
                    token_role = result.rows[0].role;
                    return client.query(Database.QueryStrings.SelectProfileByUsername, [target_username]);
                }
            })
            .then((result) => {
                if(returnStatus == -1) {
                    target_role = result.rows[0].role;

                    if(token_role == 'admin' && target_role == 'regular') {
                        returnStatus = 200;
                        client.query(Database.QueryStrings.DeleteProfile, [target_username]);
                    }
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            }).catch((e) => {console.error(e);});

            client.release();
        })().catch((e) => {});
    });
};