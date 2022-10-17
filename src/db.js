const mysql = require('mysql2/promise')
const { db } = require("./config")

const pool = mysql.createPool({
  connectionLimit: 20,
  database: db.name,
  host: db.host,
  user: db.user,
  password: db.password,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = { pool }