const express = require("express")
const path = require("path")
const apiRoutesPublics = require("./routes/api/publics")

const app = express()

// Settings
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))

// Static Fields
app.use(express.static('src/public'))

// Routes
app.use('/api/v1', apiRoutesPublics)
app.get('/', (req, res) => res.send("Wecolme to Server"))

// Start Server
app.listen(process.env.PORT || 5000)
console.log("Server on port", process.env.PORT || 5000)