import express from 'express'
import cors from 'cors'
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
import { checkout } from './checkout/checkout.controller'

export const router = express.Router()
var corsOptions = {
    origin: 'https://sandbox-api.iyzipay.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
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

//Checkout route
router.post('/checkout', cors(corsOptions), checkout)
