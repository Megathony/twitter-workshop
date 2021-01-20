const { createServer } = require("http")
const fs = require("fs/promises")

const server = createServer()

async function serveFile (response, path) {
    const file = await fs.readFile(APP_ROOT + "/" + path, "utf8")
    response.writeHead(200)
    response.end(file)
}

server.on("request", async (request, response) => {
    console.log("on request", request.method, request.url)

    switch (request.url) {
        case '/':
        case '/index.html':
            await serveFile(response, 'public/index.html')
            break
        case '/app.js':
            await serveFile(response, 'public/app.js')
            break
        default:
            response.writeHead(404)
            response.end()
    }
})
module.exports = server
