module.exports = function(app, db) {
    app.get('/category', (req, res) => {
        console.log("category get was called!");
        res.send("Call completed!");
    });

    app.put('/category', (req, res) => {
        console.log("category put was called!");
        res.send("Call completed!");
    });

    app.post('/category', (req, res) => {
        console.log("category post was called!");
        res.send("Call completed!");
    });

    app.delete('/category', (req, res) => {
        console.log("category delete was called!");
        res.send("Call completed!");
    });
};