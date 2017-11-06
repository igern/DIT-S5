
const { Client } = require('pg')
const client = new Client({
    user: 'root',
    host: 'dit-s5.cf4hu66k5z3p.eu-central-1.rds.amazonaws.com',
    database: 'Forum',
    password: '12345678',
    port: 5432,
})

client.connect()


var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const port = 20895;

require('./Routes')(app, {});

app.listen(port, () => {
    console.log('We are live on ' + port);
});