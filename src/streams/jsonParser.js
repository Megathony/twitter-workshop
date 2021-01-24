const {Transform} = require('stream')

/**
 * Transform stream to parse Json
 * @type {module:stream.internal.Transform}
 */
const jsonParser = new Transform({
    readableObjectMode: true,

    transform(chunk, _, callback) {
        let data = {}
        try {
            data = JSON.parse(chunk)
        } catch (error) {

        }
        this.push(data)
        callback()
    }
})

module.exports = jsonParser
