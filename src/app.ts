import express from 'express'
import cors from 'cors'
import moongose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import { router } from './routes'

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/', router)

const mongodbConnection = process.env.MONGODB_CONNECTION_STRING!
moongose
    .connect(mongodbConnection!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
        app.listen(5000)
    })
    .catch((err) => {
        console.log(err)
    })
