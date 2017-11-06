const { Pool } = require('pg');

const pool = new Pool({
    user: 'root',
    host: 'dit-s5.cf4hu66k5z3p.eu-central-1.rds.amazonaws.com',
    database: 'Forum',
    password: '12345678',
    port: 5432,
});

global.database = pool;