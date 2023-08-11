const express=require('express')
const Response = require('./models/Response')
const router=express.Router()

router.post('/',async (req, res) => {
    try {
        const email = req.body.email
        const message = req.body.message
        const response= await Response.create({
            email:email, message:message
        })
        res.status(200).send(response)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router