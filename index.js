require('dotenv').config()
const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

// server http
const server = require('./src/server')
const stream = require('stream')
const twitterApi = require('./src/twitterApi')
const logger = require('./src/logger');
const jsonParser = require('./src/jsonParser');
const tweetStats = require('./src/tweetStats');
const subjects = require('./src/subjects');


(async () => {
    await twitterApi.init()
    // await twitterApi.deleteAllRules()
    // //
    // await twitterApi.addRules([
    //     { value: 'parcoursup', tag: 'criteria1' },
    //     { value: 'trump', tag: 'criteria2' }
    // ])

    subjects.setSubjects(twitterApi.rules)
    twitterApi.startTweetStream()

    server.listen(3000, () => {
        console.log("Server running on port 3000")
    })
    stream.pipeline(
        twitterApi.tweetStream,
        jsonParser,
        tweetStats,
        logger,
        console.error
    )

    twitterApi.closeConnection()
})().catch(console.error)

