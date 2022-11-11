import express from 'express'
import cors from 'cors'
import moongose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import { router } from './routes'
import { Env, Req, Res } from './types'

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/', router)

app.use((req: Req, res: Res, next) => {
    const corsWhitelist = [
        'http://localhost:3000',
        'https://art-gallery-frontend.vercel.app',
        'https://sandbox-merchant.iyzipay.comn',
    ]
    if (req.headers.origin) {
        if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
            res.header('Access-Control-Allow-Origin', req.headers.origin)
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            )
        }
    }

    next()
})
const mongodbConnection: Env = process.env.MONGODB_CONNECTION_STRING
if (mongodbConnection) {
    moongose
        .connect(mongodbConnection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => {
            app.listen(5000)
        })
        .catch((err) => {
            console.log(err)
        })
}
