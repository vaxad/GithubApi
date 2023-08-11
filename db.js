const mongoose=require('mongoose')
require('dotenv').config({path:'./.env.local'})
const uri=process.env.MONGO

const connectDB=()=>{
    try {
        mongoose.connect(uri)
        console.log('mongodb connected')
    } catch (error) {
        console.log(error)
        console.log(error)
    }
}

module.exports=connectDB