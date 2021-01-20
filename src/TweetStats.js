const subjects = require('./subjects')
const { Transform } = require('stream')

class TweetStats {
    stream
    constructor(subjects = null) {
        this.setSubjects(subjects || [])
        this.initStream()
    }
    setSubjects (subjects) {
        this.subjects = []
        subjects.forEach(subject => {
            this.subjects.push({
                value: subject.toLowerCase(),
                tag: subject.toLowerCase(),
                numberOfTweets: 0
            })
        })
    }
    matchSubject (tag) {
        // console.log(this.subjects, tag)
        return this.subjects.find(subject => subject.tag === tag)
    }

    initStream() {
        const self = this
        this.stream = new Transform({
            objectMode: true,
            transform(chunk, _, callback) {
                if (chunk.matching_rules) {
                    const subject = self.matchSubject(chunk.matching_rules?.[0]?.tag || '')
                    console.log(subject)
                    if (subject) {
                        subject.numberOfTweets++
                        this.push(subject)
                    }
                }
                callback()
            }
        })
    }
}

module.exports = TweetStats
