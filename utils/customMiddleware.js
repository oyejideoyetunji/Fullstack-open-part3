const morgan = require("morgan")


morgan.token("body", function (req) {
    return JSON.stringify(req.body)
})

const reqResLogger = morgan(":method :url :status :res[content-length] - :response-time ms :body")

function errorhandler(error, req, res, next){

    if (error.name === "CastError") {
        return res.status(400).send({ message: "malformated id" })
    } else if (error.name === "ValidationError") {
        res.status(400)
        res.json({
            message: error.message
        })
    } else {
        res.status(500).json({ message: "an error ocurred" })
    }

    next(error)
}

function unknownEndpoint(req, res){
    res.status(404).send({ message: "unknown endpoint" })
}


module.exports = { reqResLogger, errorhandler, unknownEndpoint }
