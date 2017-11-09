var JWT = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/category', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectAllCategories));
            })
            .then((result) => {
                res.set('Category', JSON.stringify(result.rows));
                res.status(200).send();
            }).catch((e) => {console.error(e);});

            client.release();
        })().catch((e) => {});
    });

    app.put('/category', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectCategoryByTitle, [req.headers.title]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length != 0) {
                        returnStatus = 409; // Title is already taken.
                    }
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    return client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]);
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    var role = result.rows[0].role;
                    if(role == 'admin') {
                        return client.query(Database.QueryStrings.InsertCategory, [req.headers.title, req.headers.color]);
                    } else {
                        returnStatus = 400; // User is not an admin.
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

    app.post('/category', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    var role = result.rows[0].role;
                    if(role == 'admin') {
                        var Data = JSON.parse(req.headers.category);
                        return client.query(Database.QueryStrings.UpdateCategory, [Data[0], Data[1], Data[2]]);
                    } else {
                        returnStatus = 400; // User is not an admin.
                    }
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            }).catch(e => console.error(e));
            
            client.release();
        })().catch((e) => {});
    });

    app.delete('/category', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    var role = result.rows[0].role;
                    if(role == 'admin') {
                        var Data = JSON.parse(req.headers.category);
                        return client.query(Database.QueryStrings.DeleteCategory, [Data[0]]);
                    } else {
                        returnStatus = 400; // User is not an admin.
                    }
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            }).catch(e => console.error(e));
            
            client.release();
        })().catch((e) => {});
    });
};