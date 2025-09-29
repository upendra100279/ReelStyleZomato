const express=require('express')
const cookieParser=require('cookie-parser')
const authRoutes=require('./routes/auth.routes')
const foodRoutes=require('./routes/food.routes')
const cors=require('cors')


const app=express()
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("Hello Upendra")
})

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
console.log("Auth routes mounted at /api/auth");


module.exports=app;