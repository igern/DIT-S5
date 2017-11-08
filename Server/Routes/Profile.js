var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        Database.Pool.query('SELECT * FROM Profile', (err, res) => {
            console.log(res.rows[0]);
        });

        console.log("profile get was called! -> " + global.test);
        res.send("Call completed!");
    });

    app.put('/profile', (req, ress, next) => {
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
                        returnStatus = 409;
                    }
                }
            })
            .then((result) => {
                if(returnStatus == 200) {
                    if(result.rows.length == 0) {
                        client.query(Database.QueryStrings.InsertProfile, [req.headers.username, req.headers.password, req.headers.email]);
                    } else {
                        returnStatus = 400;
                    }
                }
            })
            .then((result) => {
                ress.status(returnStatus).send();
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
        console.log("profile delete was called!");
        res.send("Call completed!");
    });
};