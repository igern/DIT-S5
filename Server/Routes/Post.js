var JWT = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/post', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var Data = JSON.parse(req.headers.post);

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectAllPosts, [Data[0]]));
            })
            .then((result) => {
                res.set('Post', JSON.stringify(result.rows));
                res.status(returnStatus).send();
            }).catch((e) => {console.error(e);});

            client.release();
        })().catch((e) => {});
    });

    app.put('/post', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            var Data = JSON.parse(req.headers.post);

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectThreadByID, [Data[1]]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        returnStatus = 409; // Thread doesn't exist.
                    }
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    return client.query(Database.QueryStrings.InsertPost, [Data[0], 'test@gmail.com', Data[1]]);
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            })
            .catch(e => console.error(e));          

            client.release();
        })().catch((e) => {console.error(e);});
    });

    app.post('/post', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.
            
            var Data = JSON.parse(req.headers.post);
            
            var Creator = null;
            var Role = null;

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectPostByID, [Data[1]]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        returnStatus = 409; // Post doesn't exist.
                    } else {
                        Creator = result.rows[0].creator;
                    }
                }
            })
            .then((result) => {
                return client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]);
            })
            .then((result) => {
                Role = result.rows[0].role;
                
                if(Role == 'admin' || Creator == 'test@gmail.com') {
                    return client.query(Database.QueryStrings.UpdatePost, [Data[0], Data[1]]);
                } else {
                    returnStatus = 401; // Insufficient rights
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            })
            .catch(e => console.error(e));          

            client.release();
        })().catch((e) => {console.error(e);});
    });

    app.delete('/post', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var Data = JSON.parse(req.headers.post);

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    var role = result.rows[0].role;
                    if(role == 'admin') {
                        return client.query(Database.QueryStrings.DeletePost, [Data[0]]);
                    } else {
                        returnStatus = 400; // User is not an admin.
                    }
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            }).catch(e => console.error(e));          

            client.release();
        })().catch((e) => { console.error(e); });
    });
};