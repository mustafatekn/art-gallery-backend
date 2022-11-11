import express from 'express'
import {
    signUp,
    signIn,
    createNewUser,
    deleteUser,
    updateUser,
} from './user/user.controller'
import {
    createNewPost,
    getAllPosts,
    getPostByUrl,
    removePost,
} from './post/post.controller'
import { createNewTicket, getAllTickets } from './ticket/ticket.controller'

export const router = express.Router()

// Auth Routes
router.post('/auth/signup', signUp)
router.get('/auth/signin', signIn)
router.post('/auth/createUser', createNewUser)
router.delete('/auth/user/:id', deleteUser)
router.put('/auth/user/:id', updateUser)

// Post Routes
router.get('/posts', getAllPosts)
router.get('/post/:url', getPostByUrl)
router.post('/post/createPost', createNewPost)
router.delete('/post/:id', removePost)

//Ticket Routes
router.post('/ticket', createNewTicket)
router.get('/tickets', getAllTickets)

//Checkout Routes
// router.post('/checkout', checkout)
