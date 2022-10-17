const { Router } = require('express')
const router = Router()
const { pool } = require("../../db")

router.get('/', async (req, res) => {
  const query = `
      SELECT
      titulo, resumen, fecha_hora, pseudonimo, votos
      FROM publicaciones
      INNER JOIN autores
      ON publicaciones.autor_id = autores.id
      ORDER BY fecha_hora DESC
    `
  const result = await pool.query(query)
  res.json(result[0])
})

module.exports = router