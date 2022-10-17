require("dotenv").config()

const db = {
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

module.exports = { db }