const { pool } = require("../db")

const getPosts = async (req, res) => {
  let query
  let modifiedQuery = ""
  const search = ( req.query.search ) ? req.query.search : ""
  if (search != ""){
    modifiedQuery = `
      WHERE
      titulo LIKE '%${search}%' OR
      resumen LIKE '%${search}%' OR
      contenido LIKE '%${search}%'
    `
  }
  query = `
    SELECT *
    FROM publicaciones
    ${modifiedQuery}
    ORDER BY id
  `
  const result = await pool.query(query)
  if(result[0].length > 0) return res.status(200).json({data: result[0]})
  else return res.status(404).json({errors: "No se encontraron publicaciones"})
}

const getPost = async (req, res) => {
  let query = `SELECT * FROM publicaciones WHERE id = ${req.params.id}`
  try {
    const result = await pool.query(query)
    if(result[0].length > 0) return res.status(200).json({data: result[0]})
    else return res.status(404).json({erros: `No se encontro publicacion con id: ${req.params.id}`})
  } catch (error) {
    return res.status(500).json({errors: "Error en estructura id"})
  }
}

module.exports = {
  getPosts, getPost
}