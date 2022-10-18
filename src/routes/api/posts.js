const { Router } = require('express')
const router = Router()
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../../controllers/postsController')

router.get('/publicaciones', getPosts)

router.get('/publicaciones/:id', getPost)

router.post('/publicaciones', createPost)

router.delete('/publicaciones/:id', deletePost)

router.put('/publicaciones/:id', updatePost)

module.exports = router