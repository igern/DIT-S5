var Token = require('../Token');
var Database = require('../Database');
var Notifier = require('../Notifications');

module.exports = function(app, db) {
    app.get('/post', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.post);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectAllPosts, [Data[0]]));
            })
            .then((result) => {
                res.set('Post', JSON.stringify(result.rows));
                res.status(200).send();
            }).catch((e) => {
                console.error(e);
            });

            client.release();
        })().catch((e) => { });
    });

    app.put('/post', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.post);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectThreadByID, [Data[1]]));
            })
            .then((result) => {
                if(result.rows.length == 0) {
                    res.status(409).send();
                    return Promise.reject("Thread doesn't exist!");
                }
            })
            .then((result) => {
                return client.query(Database.QueryStrings.RefreshThread, [Data[1]]);
            })
            .then((result) => {
                return client.query(Database.QueryStrings.InsertPost, [Data[0], email, Data[1]]);                
            })
            .then((result) => {
                Notifier.AnnounceNewPost(result.rows[0].parent, result.rows[0].id, result.rows[0].content, result.rows[0].created, result.rows[0].creator);
                res.status(200).send();
            })
            .catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });

    app.post('/post', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.post);
            var email = Token.ReadData(req.headers.token);
            var Creator = null;
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectPostByID, [Data[1]]));
            })
            .then((result) => {
                if(result.rows.length == 0) {
                    res.status(409).send();
                    return Promise.reject("Post doesn't exist!");
                } else {
                    Creator = result.rows[0].creator;
                }
            })
            .then((result) => {
                return client.query(Database.QueryStrings.SelectProfileByEmail, [email]);
            })
            .then((result) => {
                if(result.rows[0].role == 'admin' || Creator == token_email) {
                    return client.query(Database.QueryStrings.UpdatePost, [Data[0], Data[1]]);
                } else {
                    res.status(401).send();
                    return Promise.reject("Insufficient rights!");
                }
            })
            .then((result) => {
                res.status(200).send();
            })
            .catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });

    app.delete('/post', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.post);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [email]));
            })
            .then((result) => {
                if(result.rows[0].role == 'admin') {
                    return client.query(Database.QueryStrings.DeletePost, [Data[0]]);
                } else {
                    res.status(400).send();
                    return Promise.reject("User is not an admin!");
                }
            })
            .then((result) => {
                Notifier.AnnounceDeletedPost(Data[0], Data[1]);
                res.status(200).send();
            }).catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });
};