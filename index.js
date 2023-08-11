const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
const connectDB = require('./db')
connectDB()
app.use(cors())
app.get("/", (req, res) => {
    res.send('server is live')
})

app.use('/send', require('./responses'))

const server = app.listen(4000, () => {
    console.log('server up')
})