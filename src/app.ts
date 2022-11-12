import express from 'express'
import cors from 'cors'
import moongose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import { router } from './routes'
import { Env } from './types'

dotenv.config()
const app = express()

var allowList = [process.env.FRONTEND_URI, process.env.IYZICO_URI]
var corsOptions = {
    origin: function (origin: any, callback: any) {
        if (allowList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('This url has not been permitted by CORS.'))
        }
    },
}

app.use(cors(corsOptions))
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
