const {Pool} = require('pg')
const dotenv = require('dotenv')

dotenv.config()

// Database connection pool to connect to the database
const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
})

module.exports = pool;

