import express from 'express'
import cors from 'cors'
import bookRouter from '../src/routes/books.route.js'
import userRouter from '../src/routes/user.route.js'
import transactionRouter from '../src/routes/transaction.route.js'

const app = express() 

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}
))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.get("/",(req , res)=>{
    res.send("Nice , just to check ")
})

app.use("/api/user",userRouter)

app.use("/api/book",bookRouter)

app.use("/api/transaction",transactionRouter)

export {app}


