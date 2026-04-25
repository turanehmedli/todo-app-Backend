import express from 'express'
import mongoose from 'mongoose'
import dotenv  from 'dotenv'
import cors from 'cors'
import authRouter from './routes/auth.route.js'
import { protect } from './middleware/auth.middleware.js'
import todoRouter from './routes/todo.route.js'

dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected")
    } catch (error) {
        console.error("Error connected MongoDb:",error)
        process.exit(1)
    }
}

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())

app.use("/api/todos", todoRouter)
app.use("/api/auth", authRouter)

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`)
    connectDB()
})