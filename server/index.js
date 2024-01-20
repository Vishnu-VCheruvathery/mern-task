import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { userRouter } from './routes/userRoutes.js'
import { postRouter } from './routes/postRoutes.js'

const {MONGO_URL} = process.env
const app = express()

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use('/users', userRouter)
app.use('/posts', postRouter)

mongoose.connect(MONGO_URL)

app.listen(3000, () => {
    console.log('Server started on port 3000')
})