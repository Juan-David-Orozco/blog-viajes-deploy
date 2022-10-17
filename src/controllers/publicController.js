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

const getAuthors = async (req, res) => {
  let query = `SELECT email, pseudonimo FROM autores`
  const result = await pool.query(query)
  res.status(200).json({data: result[0]})
}

const getAuthor = async (req, res) => {
  //let query = `SELECT email, pseudonimo FROM autores WHERE id = ${req.params.id}`
  let query = `
      SELECT autores.id id, email, pseudonimo, publicaciones.id publicacion_id, titulo, resumen, votos
      FROM autores
      LEFT JOIN
      publicaciones ON
      autores.id = publicaciones.autor_id
      WHERE autores.id = ${req.params.id}
      ORDER BY autores.id DESC, publicaciones.fecha_hora DESC
    `
  try {
    const result = await pool.query(query)
    let AutorId = undefined
    let autor = []
    result[0].forEach(registro => {
      if (registro.id != AutorId){
        AutorId = registro.id
        autor.push({
          id: registro.id,
          pseudonimo: registro.pseudonimo,
          email: registro.email,
          publicaciones: []
        })
      }
      autor[0].publicaciones.push({
        id: registro.publicacion_id,
        titulo: registro.titulo,
        resumen: registro.resumen,
        votos: registro.votos
      })
    });
    if(autor.length > 0) return res.status(200).json({data: autor})
    else return res.status(404).json({erros: `No se encontro autor con id: ${req.params.id}`})
  } catch (error) {
    return res.status(500).json({errors: "Error en estructura id"})
  }
}

module.exports = {
  getPosts, getPost, getAuthors, getAuthor
}