const {Transform} = require('stream')

const filter = new Transform({
    objectMode: true,

    transform(chunk, _, callback) {
        console.log(!!chunk.data?.geo)
        this.push(chunk)
        callback()
    }
})

module.exports = filter
