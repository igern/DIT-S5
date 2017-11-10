var Token = require('../Token');
var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/category', (req, res) => {
        (async() => {
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectAllCategories));
            }).then((result) => {
                res.set('Category', JSON.stringify(result.rows));
                res.status(200).send();
            }).catch((e) => {
                console.error(e);
            });

            client.release();
        })().catch((e) => { });
    });

    app.put('/category', (req, res) => {
        (async() => {
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectCategoryByTitle, [req.headers.title]));
            }).then((result) => {
                if(result.rows.length != 0) {
                    res.status(409).send();
                    return Promise.reject("Title is already taken!");
                }
            }).then((result) => {
                return client.query(Database.QueryStrings.SelectProfileByEmail, [email]);
            }).then((result) => {
                if(result.rows[0].role == 'admin') {
                    return client.query(Database.QueryStrings.InsertCategory, [req.headers.title, req.headers.color]);
                } else {
                    res.status(400).send();
                    return Promise.reject("User is not an admin!");
                }
            }).then((result) => {
                res.status(200).send();
            }).catch((e) => { 
                console.error(e)
            });          

            client.release();
        })().catch((e) => { });
    });

    app.post('/category', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.category);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [email]));
            }).then((result) => {
                if(result.rows[0].role == 'admin') {
                    return client.query(Database.QueryStrings.UpdateCategory, [Data[0], Data[1], Data[2]]);
                } else {
                    res.status(400).send();
                    return Promise.reject("User is not an admin!");
                }
            }).then((result) => {
                res.status(200).send();
            }).catch((e) => {
                console.error(e)
            });
            
            client.release();
        })().catch((e) => { });
    });

    app.delete('/category', (req, res) => {
        (async() => {
            var Data = JSON.parse(req.headers.category);
            var email = Token.ReadData(req.headers.token);
            const client = await Database.Pool.connect();

            new Promise((resolve) => {
                resolve(client.query(Database.QueryStrings.SelectProfileByEmail, [email]));
            }).then((result) => {
                if(result.rows[0].role == 'admin') {
                    return client.query(Database.QueryStrings.DeleteCategory, [Data[0]]);
                } else {
                    res.status(400).send();
                    return Promise.reject("User is not an admin!");
                }
            }).then((result) => {
                res.status(200).send();
            }).catch((e) => {
                console.error(e)
            });
            
            client.release();
        })().catch((e) => { });
    });
};