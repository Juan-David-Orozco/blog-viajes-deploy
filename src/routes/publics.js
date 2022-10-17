const { Router } = require('express')
const router = Router()
const { pool } = require("../db")

router.get('/', async (req, res) => {
  const result = await pool.query("SELECT * FROM users")
  res.json(result[0])
})

module.exports = router