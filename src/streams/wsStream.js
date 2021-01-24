/**
 * Custom WS Stream to handle manually the JSON.parse step
 */

const {Writable} = require('stream')

const wsStream = client => {
    return new Writable({
        objectMode: true,
        write(chunk, encoding, callback) {
            client.send(JSON.stringify(chunk))
            callback()
        }
    })
}

module.exports = wsStream
