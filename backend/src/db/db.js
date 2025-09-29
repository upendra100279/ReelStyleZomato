const mongoose=require('mongoose')


function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB Connected successfully")
    })
    .catch((err)=>{
         console.log("Error connecting with database : ",err)
    })
}

module.exports=connectDB;