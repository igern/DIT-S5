module.exports = function(app, db) {
    app.put('/subscribe', (req, res) => {
        console.log("thread get was called!");
        res.send("Call completed!");
    });

    app.delete('/subscribe', (req, res) => {
        console.log("thread put was called!");
        res.send("Call completed!");
    });
};