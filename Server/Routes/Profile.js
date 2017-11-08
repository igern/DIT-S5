var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        Database.Pool.query('SELECT * FROM Profile', (err, res) => {
            console.log(res.rows[0]);
        });

        console.log("profile get was called! -> " + global.test);
        res.send("Call completed!");
    });

    app.put('/profile', (req, ress) => {
        (async() => {
            const client = await Database.Pool.connect();

            try {
                client.query(Database.QueryStrings.SelectProfileByUsername, [req.headers.username], (err, res) => {
                    if(res.rows.length > 0) {
                        ress.status(409).send("Username is already in use!");
                    } else {
                        client.query(Database.QueryStrings.SelectProfileByEmail, [req.headers.email], (err, res) => {
                            if(res.rows.length > 0) {
                                ress.status(400).send("Email is already in use!");
                            } else {
                                client.query(Database.QueryStrings.InsertProfile, [req.headers.username, req.headers.password, req.headers.email], (err, res) => {
                                    ress.status(200).send("Account successfully created!");
                                });
                            }
                        });
                    }
                });
            } catch(err) {
                console.log(err);
            } finally {
                client.release();
            }            
        })().catch(e => console.error(e.stack));
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