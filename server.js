const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')


const PORT = process.env.PORT || 5004

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan())

// Start the server
app.listen(PORT,() => {
    console.log(`Communication Service is running on port ${PORT}`)
})


