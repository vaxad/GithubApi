const express = require('express')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
app.use(express.json())
const cors = require('cors')
const connectDB = require('./db')
connectDB()
app.use(cors())
app.get("/", (req, res) => {
    res.send('server is live')
})
app.use('/mail', require('./routes/mail'))
const port=4000
const server = app.listen(port, () => {
    console.log('server up at '+port)
})