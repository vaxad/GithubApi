const mongoose=require('mongoose')
const responseSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const Response = mongoose.model('response', responseSchema)

module.exports=Response