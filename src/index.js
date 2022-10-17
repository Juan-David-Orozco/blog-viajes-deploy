const express = require("express")

const app = express()

app.get('/', (req, res) => res.send("Wecolme to Server"))

app.listen(process.env.PORT || 5000)
console.log("Server on port", process.env.PORT || 5000)