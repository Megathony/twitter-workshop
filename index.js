require('dotenv').config()
const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

// server http
const server = require('./src/server')
const stream = require('stream')
const twitterApi = require('./src/twitterApi')
const logger = require('./src/logger');
const jsonParser = require('./src/jsonParser');
const filter = require('./src/filter');
// connexion api twitter
// traitements
// twitterApi.setRules()


(async () => {
    await twitterApi.init()
    await twitterApi.deleteAllRules()
    //
    await twitterApi.addRules({value: '#trump has:geo'})
    twitterApi.startTweetStream()

    server.listen(3000, () => {
        console.log("Server running on port 3000")
    })
    stream.pipeline(
        twitterApi.tweetStream,
        jsonParser,
        filter,
        logger,
        console.error
    )

    twitterApi.closeConnection()
})().catch(console.error)

