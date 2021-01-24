const clientsRules = require('../clientsRules')
const {Transform} = require('stream')

/**
 * Transfomr stream aimed at counting tweets matching each rule
 * @type {module:stream.internal.Transform}
 */
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
