const subjects = {
    subjects: [],
    setSubjects (subjects) {
        this.subjects = []
        subjects.forEach(subject => {
            subject.numberOfTweets = 0
            this.subjects.push(subject)
        })
    },
    matchSubject (tag) {
        return this.subjects.find(subject => subject.tag === tag)
    }
}

module.exports = subjects
