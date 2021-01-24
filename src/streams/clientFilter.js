const {Transform} = require('stream')

/**
 * Generates a Transform stream that filters tweet stats based on the client Id
 * @param clientId
 * @returns {module:stream.internal.Transform}
 */
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
