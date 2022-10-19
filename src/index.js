const express = require("express")
const path = require("path")
const cors = require("cors")
const apiRoutesPosts = require("./routes/api/posts")
const apiRoutesAuthors = require("./routes/api/authors")

const app = express()

// Settings
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))

// Static Fields
app.use(express.static('src/public'))

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
//app.use('/api/v1', apiRoutesPublics)
app.use('/api/v1', apiRoutesPosts)
app.use('/api/v1', apiRoutesAuthors)
app.get('/api', (req, res) => res.send("Wecolme to Server"))

// Start Server
app.listen(process.env.PORT || 5000)
console.log("Server on port", process.env.PORT || 5000)