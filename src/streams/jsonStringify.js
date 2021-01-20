const {Transform} = require('stream')

const jsonStringify = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        this.push(JSON.stringify(chunk))
        callback()
    }
})

module.exports = jsonStringify
