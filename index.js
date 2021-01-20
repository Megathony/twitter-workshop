require('dotenv').config()
const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

const WebSocket = require('ws')
const server = require('./src/server')
const stream = require('stream')
const twitterApi = require('./src/twitterApi')
const jsonParser = require('./src/streams/jsonParser')
const logger = require('./src/streams/logger')
const tweetsCounter = require('./src/streams/tweetsCounter')
const clientsRules = require('./src/clientsRules')
const clientFilter = require('./src/streams/clientFilter')
const wsStream = require('./src/streams/wsStream')
const { v4: uuidv4 } = require('uuid')


const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    const clientId = uuidv4()
    client.send(clientId)
    client.on("message", async (subject) => {
        console.log("message from client: ", subject)
        // clientTweetStats.setSubjects([ subject ])
        await clientsRules.addRules([ subject ], clientId)
        console.log('rule added')
    })
    client.on('close', () => {
        socketStream.end()
    })

    // const clientFilter = new stream.Transform({
    //     objectMode: true,
    //     transform(chunk, encoding, callback) {
    //         client.send(JSON.stringify(chunk))
    //         callback()
    //     }
    // })
    const clientFilterStream = clientFilter(clientId)
    const socketStream = wsStream(client)
    // envoyer des données au client via websocket
    stream.pipeline(
        twitterApi.tweetStream,
        jsonParser,
        tweetsCounter,
        clientFilterStream,
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

