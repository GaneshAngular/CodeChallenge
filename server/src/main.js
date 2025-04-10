import 'dotenv/config'
import connectMongo from './config/mongoose.config.js';
import cors from 'cors'
import express from 'express'
import apiRoute from './routes/api.routes.js';
import { getSocketServer } from './services/socket.io.service.js';
import authenticationMiddleware from './middleware/authentication.middleware.js';
import logsMiddleware from './middleware/logs.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import checkCache from './middleware/checkCache.middleware.js';
const app = express()
const { server, io } = await getSocketServer(app)



connectMongo()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(errorHandler)
app.use(checkCache)
app.get('/welcome', (req, res) => {

    return res.json({ message: "Welcome " })
})


app.use('/api', authenticationMiddleware, apiRoute)

server.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`)
})
