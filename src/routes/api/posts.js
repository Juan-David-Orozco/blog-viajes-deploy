const { Router } = require('express')
const router = Router()
const { getPosts, getPost } = require('../../controllers/postsController')

router.get('/publicaciones', getPosts)

router.get('/publicaciones/:id', getPost)

module.exports = router