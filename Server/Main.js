var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var rest_app = express();

rest_app.use(bodyParser.urlencoded({ extended: false }));
rest_app.use(bodyParser.json());

rest_app.options('*', cors());

rest_app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Expose-Headers", "Response, Token, Profile, Category, Thread, Post");
    next();
});

require('./Notifications');
require('./Database');
require('./Routes')(rest_app, {});

const port = 20895;
rest_app.listen(port, () => {
    console.log('Forum live @ 127.0.0.1:' + port);
});