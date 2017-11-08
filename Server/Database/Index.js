const { Pool } = require('pg');
const SQLStrings = require('./Queries');

var config = require('./db-config.json');

const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
});

exports.Pool = pool;
exports.QueryStrings = SQLStrings;