const {Transform} = require('stream')

const clientFilter = clientId => {
    return new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
            if (chunk.clients.includes(clientId)) {
                this.push(chunk)
            }
            callback()
        }
    })
}

module.exports = clientFilter
