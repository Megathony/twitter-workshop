const {Writable} = require('stream')

const logger = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (err) {
            console.log(chunk)
        }
        callback()
    }
})

module.exports = logger
