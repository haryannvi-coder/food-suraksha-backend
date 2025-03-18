const express = require('express')
const app = express()
const port = 3005
const connectDB = require("./db.js")
require('dotenv').config()
const fsoRouter = require("./routes/fso.routes.js")
const hotelRouter = require("./routes/hotel.routes.js")
const cors = require("cors")


app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/v1/fso", fsoRouter)
app.use("/api/v1/hotel", hotelRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})