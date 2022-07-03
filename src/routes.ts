import express from 'express'
import {
    signUp,
    signIn,
    createNewUser,
    deleteUser,
    updateUser,
} from './user/user.controller'
import { createNewPost, removePost } from './post/post.controller'

export const router = express.Router()

//Auth Routes
router.post('/auth/signup', signUp)
router.get('/auth/signin', signIn)
router.post('/auth/createUser', createNewUser)
router.delete('/auth/user/:id', deleteUser)
router.put('/auth/user/:id', updateUser)

//Post Routes
router.post('/post/createPost', createNewPost)
router.delete('/post/:id', removePost)
