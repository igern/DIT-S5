var JWT = require('jsonwebtoken');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/thread', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;
            //var Data = JSON.parse(req.headers.thread);

            new Promise((resolve) => {
                if(req.headers.parentid != undefined) {
                    // all threads
                    resolve(client.query(Database.QueryStrings.SelectThreadByParentID, [req.headers.parentid]));
                } else if(req.headers.id != undefined) {
                    // one specific thread
                    resolve(client.query(Database.QueryStrings.SelectThreadByID, [req.headers.id]));
                } else if(req.headers.creator != undefined) {
                    // every thread made by user
                } else {
                    returnStatus = 400; // No action defined for input.
                }
            })
            .then((result) => {
                res.set('Thread', JSON.stringify(result.rows));
                res.status(returnStatus).send();
            }).catch((e) => {console.error(e);});

            client.release();
        })().catch((e) => {});
    });

    app.put('/thread', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            var Data = JSON.parse(req.headers.thread);

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectCategoryByID, [Data[1]]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        returnStatus = 409; // Category doesn't exist.
                    }
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    return client.query(Database.QueryStrings.InsertThread, [Data[0], 'test@gmail.com', Data[1]]);
                }
            })
            .then((result) => {
                res.status(returnStatus).send();
            })
            .catch(e => console.error(e));          

            client.release();
        })().catch((e) => {console.error(e);});
    });

    app.post('/thread', (req, res) => {
        res.status(404).send();
        //console.log("thread post was called!");
        //res.send("Call completed!");
    });

    app.delete('/thread', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();
            var returnStatus = 200;

            var Data = JSON.parse(req.headers.thread);

            var decoded = JWT.decode(req.headers.token, {complete: true});
            var token_username = decoded.payload.data.replace('"', '').replace('"', ''); // needs to be replaced with a RegEx expression.

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByUsername, [token_username]));
            })
            .then((result) => {
                if(returnStatus == 200) {
                    var role = result.rows[0].role;
                    if(role == 'admin') {
                        return client.query(Database.QueryStrings.DeleteThread, [Data[0]]);
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