/**
 * A class to handle a set of subjects
 */
class SubjectsSet {
    subjects = []
    constructor(subjects = null) {
        if (subjects) this.setSubjects(subjects)
    }
    setSubjects (subjects) {
        this.subjects = []
        subjects.forEach(subject => {
            subject.numberOfTweets = 0
            this.subjects.push(subject)
        })
    }
    matchSubject (tag) {
        return this.subjects.find(subject => subject.tag === tag)
    }
}

module.exports = SubjectsSet
