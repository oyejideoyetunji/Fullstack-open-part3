const config = require("./utils/config")
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const logger = require("./utils/logger")
const personRouter = require("./controllers/person")
const customMiddleware = require("./utils/customMiddleware")
const app = express()



logger.info("connecting to url")
mongoose.connect(
    config.url,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
).then(() => {
    logger.info("successfully connected to mongoDB")
}).catch(error => {
    logger.error("error connecting to mongodb: ", error.message)
})

app.use(cors())
app.use(express.json())
app.use(express.static("build"))
app.use(customMiddleware.reqResLogger)
app.use("/api/persons", personRouter)
app.use(customMiddleware.errorhandler)
app.use(customMiddleware.unknownEndpoint)

module.exports = app
