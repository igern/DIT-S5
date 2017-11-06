module.exports = function(app, db) {
    app.post('/auth', (req, res) => {
        console.log("authentication post was called!");
        res.send("Call completed!");
    });

    app.get('/auth', (req, res) => {
        console.log("authentication get was called!");
        res.send("Call completed!");
    });
};