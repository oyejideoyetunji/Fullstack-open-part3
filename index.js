const config = require("./utils/config")
const app = require("./app")
const http = require("http")
const logger = require("./utils/logger")



const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`listening on port ${config.PORT}......`)
})
