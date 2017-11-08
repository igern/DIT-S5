var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/thread', (req, res) => {
        console.log("thread get was called!");
        res.send("Call completed!");
    });

    app.put('/thread', (req, res) => {
        console.log("thread put was called!");
        res.send("Call completed!");
    });

    app.post('/thread', (req, res) => {
        console.log("thread post was called!");
        res.send("Call completed!");
    });

    app.delete('/thread', (req, res) => {
        console.log("thread delete was called!");
        res.send("Call completed!");
    });
};