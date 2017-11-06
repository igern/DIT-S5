var express = require('express');
var bodyParser = require('body-parser');
var rest_app = express();

const port = 20895;

require('./Notifications');
require('./Database');
require('./Routes')(rest_app, {});

global.test = "bla";

rest_app.listen(port, () => {
    console.log('We are live on ' + port);
});