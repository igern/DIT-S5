var express = require('express');
var bodyParser = require('body-parser');
var rest_app = express();

const port = 20895;

require('./Notifications');
require('./Database');
require('./Routes')(rest_app, {});

rest_app.listen(port, () => {
    console.log('Forum live @ 127.0.0.1:' + port);
});