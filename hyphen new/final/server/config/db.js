const mysql = require('mysql2');
require('dotenv').config();  // Make sure you have dotenv installed

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const promisePool = pool.promise();

module.exports = promisePool;
