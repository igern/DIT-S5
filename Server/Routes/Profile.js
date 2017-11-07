module.exports = function(app, db) {
    app.get('/profile', (req, res) => {
        global.database.query('SELECT * FROM Profile', (err, res) => {
            console.log(res.rows[0]);
        });

        console.log("profile get was called! -> " + global.test);
        res.send("Call completed!");
    });

    app.put('/profile', (req, res) => {
        console.log("profile put was called!");
        res.send("Call completed!");
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