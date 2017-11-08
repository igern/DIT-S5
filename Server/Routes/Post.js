var Database = require('../Database');

module.exports = function(app, db) {
    app.get('/post', (req, res) => {
        console.log("post get was called!");
        res.send("Call completed!");
    });

    app.put('/post', (req, res) => {
        console.log("post put was called!");
        res.send("Call completed!");
    });

    app.post('/post', (req, res) => {
        console.log("post post was called!");
        res.send("Call completed!");
    });

    app.delete('/post', (req, res) => {
        console.log("post delete was called!");
        res.send("Call completed!");
    });
};