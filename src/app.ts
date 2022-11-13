import express from 'express'
// import cors from 'cors'
import moongose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import { router } from './routes'
import { Env } from './types'

dotenv.config()
const app = express()

// var corsOptions = {
//     origin: [process.env.FRONTEND_LOCAL_URI!, process.env.FRONTEND_URI!],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
// }

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', ["https://art-gallery-frontend.vercel.app", "http://localhost:3000"]) // update to match the domain you will make the request from
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

// app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', router)

const mongodbConnection: Env = process.env.MONGODB_CONNECTION_STRING
if (mongodbConnection) {
    moongose
        .connect(mongodbConnection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => {
            app.listen(process.env.PORT || 5000)
        })
        .catch((err) => {
            console.log(err)
        })
}
