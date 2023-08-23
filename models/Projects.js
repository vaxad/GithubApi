const {Schema, model} = require('mongoose')

const projectsSchema = new Schema({
    web:[{
        title:String,
        desc:String,
        url:String,
        img:[String],
        web:String,
        id:String
    }],
    app:[{
        title:String,
        desc:String,
        url:String,
        web:String,
        id:String,
        img:[String]
    }],
    server:[{
        title:String,
        desc:String,
        url:String,
        web:String,
        id:String
    }],
    updated:{
        type:Date,
        default:Date.now()
    }
})

const Projects = model ('projects', projectsSchema)

module.exports = Projects