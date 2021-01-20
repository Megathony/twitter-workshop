require('dotenv').config()
const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

const WebSocket = require('ws')
const server = require('./src/server')
const stream = require('stream')
const twitterApi = require('./src/twitterApi')
const logger = require('./src/streams/logger');
const jsonParser = require('./src/streams/jsonParser');
const TweetStats = require('./src/TweetStats');
const jsonStringify = require('./src/streams/jsonStringify')


const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    const clientTweetStats = new TweetStats()

    client.on("message", (subject) => {
        console.log("message from client: ", subject)
        clientTweetStats.setSubjects([ subject ])
        twitterApi.addRules(clientTweetStats.subjects)
    })

    const socketStream = WebSocket.createWebSocketStream(client);
    client.on('close', () => {
        socketStream.end()
    })

    // envoyer des données au client via websocket

    stream.pipeline(
        twitterApi.tweetStream,
        jsonParser,
        clientTweetStats.stream,
        jsonStringify,
        socketStream,
        console.error
    )
});
server.listen(3000, () => {
    console.log("Server running on port 3000")
});


;(async () => {
    await twitterApi.init()
    await twitterApi.deleteAllRules()
    twitterApi.startTweetStream()
})()
// ;(async () => {
//     await twitterApi.init()
//     // await twitterApi.deleteAllRules()
//     // //
//     // await twitterApi.addRules([
//     //     { value: 'parcoursup', tag: 'criteria1' },
//     //     { value: 'trump', tag: 'criteria2' }
//     // ])
//     twitterApi.startTweetStream()
//
//     server.listen(3000, () => {
//         console.log("Server running on port 3000")
//     })
//     stream.pipeline(
//         twitterApi.tweetStream,
//         jsonParser,
//         tweetStats,
//         logger,
//         console.error
//     )
//
//     twitterApi.closeConnection()
// })().catch(console.error)

