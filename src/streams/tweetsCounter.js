const clientsRules = require('../clientsRules')
const {Transform} = require('stream')

const tweetsCounter = new Transform({
    objectMode: true,
    transform(chunk, _, callback) {
        if (chunk.matching_rules) {
            const incrementedRule = clientsRules.increment(chunk.matching_rules[0].tag)
            if (incrementedRule) {
                this.push(incrementedRule)
            }
        }
        callback()
    }
})

module.exports = tweetsCounter
