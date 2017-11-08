var jwt = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        Database.Pool.query('SELECT * FROM Profile', (err, res) => {
            console.log(res.rows[0]);
        });

        res.status(200).send();
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
        console.log("profile post was called!");
        res.send("Call completed!");
    });

    app.delete('/profile', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = -1;

            var decoded = jwt.decode(req.headers.token, {complete: true});
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
                    token_role = result.rows[0].rolle;
                    return client.query(Database.QueryStrings.SelectProfileByUsername, [target_username]);
                }
            })
            .then((result) => {
                if(returnStatus == -1) {
                    target_role = result.rows[0].rolle;

                    if(token_role == 'Admin' && target_role == 'Regular') {
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