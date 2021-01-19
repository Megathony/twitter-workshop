const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

// server http
const server = require('./src/server')
server.listen(3000, () => {
    console.log("Server running on port 3000")
})
// connexion api twitter

// traitements
