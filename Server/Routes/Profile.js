module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        global.database.query('SELECT * FROM Profile', (err, res) => {
            console.log(res.rows[0]);
        });

        console.log("profile get was called! -> " + global.test);
        res.send("Call completed!");
    });

    app.put('/profile', (req, ress) => {
        
        (async() => {
            var username = req.headers.username;
            var password = req.headers.password;
            var email = req.headers.email;
            var inUse = false;
            console.log("Request -> " + username + " - " + password + " - " + email);

            const client = await global.database.connect();

            try {
                const usernameQuery = "SELECT * FROM profile WHERE brugernavn=$1";
                const usernameValue = [username];
                
                console.log("Checking username!");
                client.query(usernameQuery, usernameValue, (err, res) => {
                    if(err) {
                        console.log(err.stack);
                    } else {
                        if(res.rows.length > 0) {
                            console.log("Username already in use!");
                            inUse = true;
                            //new Err("Username already in use!");
                            ress.status(400).send("Username is already in use!");
                        } else {
                            const emailQuery = "SELECT * FROM profile WHERE email=$1";
                            const emailValue = [email];
        
                            console.log("Checking email!");
                            client.query(emailQuery, emailValue, (err, res) => {
                                if(err) {
                                    console.log(err.stack);
                                } else {
                                    if(res.rows.length > 0) {
                                        ress.status(400).send("Email is already in use!");
                                        console.log("Email already in use!");
                                        inUse = true;
                                    } else {
                                        const insertQuery = "INSERT INTO profile (brugernavn, kodeord, email) VALUES ($1, $2, $3)";
                                        const insertValue = [username, password, email];
                                        console.log("not null -> " + email);
                                        
                                        console.log("Inserting!");
                                        client.query(insertQuery, insertValue, (err, res) => {
                                            if(err) {
                                                console.log(err.stack);
                                            } else {
                                                ress.status(200).send("Account successfully created!");
                                                console.log("Done inserting!");
                                            }
                                        });
                                    }
                                }
                            });
                            console.log("Done checking email!");
                        }
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