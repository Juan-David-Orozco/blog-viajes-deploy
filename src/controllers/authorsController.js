const { pool } = require("../db")

const getAuthors = async (req, res) => {
  try {
    let query = `SELECT id, email, pseudonimo FROM autores`
    const result = await pool.query(query)
    if (result[0].length == 0) return res.status(404).json({ message: "No se encontraron autores" })
    return res.status(200).json({ data: result[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).jsom({ error: "Error en el servidor" })
  }
}

const getAuthor = async (req, res) => {
  try {
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
    const result = await pool.query(query)
    let AutorId = undefined
    let autor = []
    result[0].forEach(registro => {
      if (registro.id != AutorId) {
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
    if (autor.length == 0) return res.status(404).json({ message: `No se encontro autor con id: ${req.params.id}` })
    return res.status(200).json({ data: autor })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en estructura id" })
  }
}

const createAuthor = async (req, res) => {
  try {
    const { email, contrasena, pseudonimo } = req.body
    if (email === undefined || contrasena === undefined || pseudonimo === undefined) {
      return res.status(500).json({ message: "Ingrese todos los campos" })
    } else if (email === "" || contrasena === "" || pseudonimo === "") {
      return res.status(500).json({ message: "Los campos no pueden ser vacios" })
    } else {
      let queryEmail = `SELECT * FROM autores WHERE email = '${email}'`
      const result = await pool.query(queryEmail)
      if (result[0].length > 0) return res.json({ message: "Email duplicado" })
      else {
        let queryPseudonimo = `SELECT * FROM autores WHERE pseudonimo = '${pseudonimo}'`
        const result = await pool.query(queryPseudonimo)
        if (result[0].length > 0) return res.json({ message: "Pseudonimo duplicado" })
        else {
          let query = `INSERT INTO autores (email, contrasena, pseudonimo) 
            VALUES ('${email}', '${contrasena}', '${pseudonimo}')`
          const result = await pool.query(query)
          const nuevoId = result[0].insertId
          let queryAuthor = `SELECT * FROM autores WHERE id = ${nuevoId}`
          const response = await pool.query(queryAuthor)
          const newAuthor = response[0][0]
          return res.status(201).json({ message: "Created author successfully", data: newAuthor })
        }
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error in created author" })
  }
}

const deleteAuthor = async (req, res) => {
  try {
    let queryAuthor = `SELECT * FROM autores WHERE id = ${req.params.id}`
    const result = await pool.query(queryAuthor)
    if (result[0].length === 0) return res.status(404).json({ message: "Author not found" })
    let queryDelete = `DELETE FROM autores WHERE id = ${result[0][0].id}`
    await pool.query(queryDelete)
    return res.status(204).json("Deleted author successfully")
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error in deleted author" })
  }
}

const updateAuthor = async (req, res) => {
  try {
    const { email, contrasena, pseudonimo } = req.body
    if (email === undefined || contrasena === undefined || pseudonimo === undefined) {
      return res.status(500).json({ message: "Ingrese todos los campos" })
    } else if (email === "" || contrasena === "" || pseudonimo === "") {
      return res.status(500).json({ message: "Los campos no pueden ser vacios" })
    } else {
      let queryAuthor = `SELECT * FROM autores WHERE id = ${req.params.id}`
      const result = await pool.query(queryAuthor)
      if (result[0].length === 0) return res.status(404).json({ message: "Author not found" })
      const authorId = result[0][0].id
      let queryUpdate = `UPDATE autores SET
        email = '${email}', contrasena = '${contrasena}', pseudonimo = '${pseudonimo}'
        WHERE id = '${authorId}'`
      const response = await pool.query(queryUpdate)
      if(response[0].affectedRows === 1) {
        let queryUpdateAuthor = `SELECT * FROM autores WHERE id = '${authorId}'`
        const resGetAuthor = await pool.query(queryUpdateAuthor)
        const updatedAuthor = resGetAuthor[0]
        return res.status(200).json({ message: "Updated author successfully", data: updatedAuthor})
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error in updated author" })
  }
}

module.exports = {
  getAuthors, getAuthor, createAuthor, deleteAuthor, updateAuthor
}