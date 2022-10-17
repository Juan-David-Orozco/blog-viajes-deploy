const { Router } = require('express')
const router = Router()
const { getPosts, getPost, getAuthors, getAuthor } = require('../../controllers/publicController')

router.get('/publicaciones', getPosts)

router.get('/publicaciones/:id', getPost)

router.get('/autores', getAuthors)

router.get('/autores/:id', getAuthor)

module.exports = router