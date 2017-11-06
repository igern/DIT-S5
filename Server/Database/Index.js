const { Pool } = require('pg');

var config = require('./db-config.json');

const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
});

global.database = pool;