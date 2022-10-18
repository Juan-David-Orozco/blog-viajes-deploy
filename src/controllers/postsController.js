const { pool } = require("../db")

const getPosts = async (req, res) => {
  try {
    let query
    let modifiedQuery = ""
    let search = (req.query.search) ? req.query.search : ""
    if (search != "") {
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
    if (result[0].length > 0) return res.status(200).json({ data: result[0] })
    return res.status(404).json({ message: "No se encontraron publicaciones" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en el servidor"})
  }
}

const getPost = async (req, res) => {
  try {
    let query = `SELECT * FROM publicaciones WHERE id = ${req.params.id}`
    const result = await pool.query(query)
    if (result[0].length > 0) return res.status(200).json({ data: result[0] })
    return res.status(404).json({ message: `No se encontro publicacion con id: ${req.params.id}` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en estructura id" })
  }
}

const createPost = async (req, res) => {
  try {
    const { titulo, resumen, contenido } = req.body
    const { email, contrasena } = req.query
    if (titulo === undefined || resumen === undefined || contenido === undefined) {
      return res.status(500).json({ message: "Ingrese todos los campos" })
    } else if (titulo === "" || resumen === "" || contenido === "") {
      return res.status(500).json({ message: "Los campos no pueden ser vacios" })
    } else {
      const queryAuthor = `SELECT * FROM autores WHERE 
        email = '${email}' AND contrasena = '${contrasena}'
      `
      const result = await pool.query(queryAuthor)
      if (result[0].length === 0) return res.status(404).json({ message: "Credenciales invalidas" })
      const autorId = result[0][0].id
      const newDate = new Date()
      const date = `
        ${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}
      `
      let queryPost = `INSERT INTO publicaciones (titulo, resumen, contenido, autor_id, fecha_hora) 
        VALUES ( '${titulo}', '${resumen}', '${contenido}', '${autorId}', '${date}' )
      `
      const response = await pool.query(queryPost)
      const postId = response[0].insertId
      let queryNewPost = `SELECT * FROM publicaciones WHERE id = ${postId}`
      const getPost = await pool.query(queryNewPost)
      const newPost = getPost[0][0]
      return res.status(201).json({ message: "Created post successfullly", data: newPost })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en el servidor" })
  }
}

const updatePost = async (req, res) => {
  try {
    const { titulo, resumen, contenido } = req.body
    const { email, contrasena } = req.query
    if (titulo === undefined || resumen === undefined || contenido === undefined) {
      return res.status(500).json({ message: "Ingrese todos los campos" })
    } else if (titulo === "" || resumen === "" || contenido === "") {
      return res.status(500).json({ message: "Los campos no pueden ser vacios" })
    } else {
      let queryAuthor = `SELECT * FROM autores WHERE
        email = '${email}' AND contrasena = '${contrasena}'`
      const result = await pool.query(queryAuthor)
      if (result[0].length === 0) return res.status(404).json({ message: "Credenciales invalidas" })
      const authorId = result[0][0].id
      let queryPost = `SELECT * FROM publicaciones WHERE
        id = '${req.params.id}' AND autor_id = '${authorId}'`
      const response = await pool.query(queryPost)
      if(response[0].length === 0) return res.status(404).json({message: "Post not found"})
      const postId = response[0][0].id
      let queryUpdatePost = `UPDATE publicaciones SET
        titulo = '${titulo}',
        resumen = '${resumen}',
        contenido = '${contenido}'
        WHERE id = '${postId}'
      `
      const responseUpdate = await pool.query(queryUpdatePost)
      if(responseUpdate[0].affectedRows === 1) {
        let queryGetPost = `SELECT * FROM publicaciones WHERE id = '${postId}'`
        const responseGetPost = await pool.query(queryGetPost)
        const updatedPost = responseGetPost[0]
        return res.status(200).json({ message: "Updated post successfully", data: updatedPost})
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en el servidor" })
  }
}

const deletePost = async (req, res) => {
  try {
    const { email, contrasena } = req.query
    let queryAuthor = `SELECT * FROM autores WHERE
      email = '${email}' AND contrasena = '${contrasena}'`
    const result = await pool.query(queryAuthor)
    if (result[0].length === 0) return res.status(404).json({ message: "Credenciales invalidas" })
    const authorId = result[0][0].id
    let queryPost = `SELECT * FROM publicaciones WHERE
      id = '${req.params.id}' AND autor_id = '${authorId}'`
    const response = await pool.query(queryPost)
    if(response[0].length === 0) return res.status(404).json({message: "Post not found"})
    const postId = response[0][0].id
    let queryDelete = `DELETE FROM publicaciones WHERE id = '${postId}'`
    await pool.query(queryDelete)
    return res.status(204).json("Deleted post successfully")
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error en el servidor" })
  }
}

module.exports = {
  getPosts, getPost, createPost, updatePost, deletePost
}