var Token = require('../Token');
var Database = require('../Database');
var Notifier = require('../Notifications');

module.exports = function(app, db) {
    app.get('/thread', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                if(req.headers.parentid != undefined) {
                    // all threads
                    resolve(client.query(Database.QueryStrings.SelectThreadsByParentID, [req.headers.parentid]));
                } else if(req.headers.id != undefined) {
                    // one specific thread
                    resolve(client.query(Database.QueryStrings.SelectThreadByID, [req.headers.id]));
                } else if(req.headers.creator != undefined) {
                    // every thread made by user
                } else {
                    // 20 most recently active threads
                    resolve(client.query(Database.QueryStrings.SelectThreadsByRecentActivity));
                }
            }).then((result) => {
                res.set('Thread', JSON.stringify(result.rows));
                res.status(200).send();
            }).catch((e) => {
                console.error(e);
            });

            client.release();
        })().catch((e) => { });
    });

    app.put('/thread', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.thread);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectCategoryByID, [Data[1]]));
            }).then((result) => {
                if(result.rows.length == 0) {
                    res.status(409).send();
                    return Promise.reject("Category doesn't exist!");
                }
            }).then((result) => {
                return client.query(Database.QueryStrings.InsertThread, [Data[0], email, Data[1]]);
            }).then((result) => {
                Notifier.AnnounceNewThread(Data[1], result.rows[0].id, Data[0], result.rows[0].created)
                res.status(200).send();
            }).catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });

    app.post('/thread', (req, res) => {
        res.status(404).send();
    });

    app.delete('/thread', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.thread);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [email]));
            })
            .then((result) => {
                if(result.rows[0].role == 'admin') {
                    return client.query(Database.QueryStrings.DeleteThread, [Data[0]]);
                } else {
                    res.status(400).send();
                    return Promise.reject("User is not an admin!");
                }
            })
            .then((result) => {
                Notifier.AnnounceDeletedThread(Data[0]);
                res.status(200).send();
            }).catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });
};