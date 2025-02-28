import 'dotenv/config'
import connectMongo from './config/mongoose.config.js';
import cors from 'cors'
import express from 'express'
import apiRoute from './routes/api.routes.js';
const app = express()

connectMongo()
app.use(cors())
app.use(express.json())

app.get('/welcome',(req,res)=>{
    return res.json({message:"Welcome "})
})
app.use('/api',apiRoute)

app.listen(process.env.PORT,()=>{
    console.log(`server listening on ${process.env.PORT}`)
})
