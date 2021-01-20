const subjects = require('./subjects')
const {Transform} = require('stream')

const tweetStats = new Transform({
    objectMode: true,

    transform(chunk, _, callback) {
        const subject = subjects.matchSubject(chunk.matching_rules?.[0]?.tag || '')
        if (subject) {
            subject.numberOfTweets++
            this.push(subject)
        }
        callback()
    }
})

module.exports = tweetStats
