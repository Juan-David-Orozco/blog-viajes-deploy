const { query } = require("express")
const { pool } = require("../db")

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

const createAuthor = async (req, res) => {
  const {email, contrasena, pseudonimo} = req.body
  try {
    let queryEmail = `SELECT * FROM autores WHERE email = '${email}'`
    const result = await pool.query(queryEmail)
    if(result[0].length > 0) return res.json({message: "Email duplicado"})
    else {
      let queryPseudonimo = `SELECT * FROM autores WHERE pseudonimo = '${pseudonimo}'`
      const result = await pool.query(queryPseudonimo)
      if(result[0].length > 0) return res.json({message: "Pseudonimo duplicado"})
      else {
        let query = `INSERT INTO autores (email, contrasena, pseudonimo) 
          VALUES ('${email}', '${contrasena}', '${pseudonimo}')
        `
        await pool.query(query)
        return res.status(201).json("Created author")
      }
    }
  } catch (error) {
    return res.status(500).json({errors: error.sqlMessage})
  }
}

const deleteAuthor = async (req, res) => {
  try {
    let queryAuthor = `SELECT * FROM autores WHERE id = ${req.params.id}`
    const result = await pool.query(queryAuthor)
    if(result[0].length === 0) return res.status(404).json({message: "Author not found"})
    else {
      let queryDelete = `DELETE FROM autores WHERE id = ${result[0][0].id}`
      await pool.query(queryDelete)
      return res.status(204).json("Deleted Author")
    }
  } catch (error) {
    return res.status(500).json({errors: error.sqlMessage})
  }
}

module.exports = {
  getAuthors, getAuthor, createAuthor, deleteAuthor
}