const { Router } = require('express')
const router = Router()
const { getAuthors, getAuthor, createAuthor, deleteAuthor, updateAuthor } = require('../../controllers/authorsController')

router.get('/autores', getAuthors)

router.get('/autores/:id', getAuthor)

router.post('/autores', createAuthor)

router.delete('/autores/:id', deleteAuthor)

router.put('/autores/:id', updateAuthor)

module.exports = router