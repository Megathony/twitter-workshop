require('dotenv').config()
const path = require('path')
global.APP_ROOT = path.resolve(__dirname);

const WebSocket = require('ws')
const server = require('./src/server')
const stream = require('stream')
const twitterApi = require('./src/twitterApi')
const jsonParser = require('./src/streams/jsonParser')
const tweetsCounter = require('./src/streams/tweetsCounter')
const clientsRules = require('./src/clientsRules')
const clientFilter = require('./src/streams/clientFilter')
const wsStream = require('./src/streams/wsStream')
const { v4: uuidv4 } = require('uuid')


const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    const clientId = uuidv4()
    client.on("message", async (message) => {
        const topics = JSON.parse(message)

        await clientsRules.removeUserRules(clientId)
        await clientsRules.addRules(topics , clientId)
    })
    client.on('close', async () => {
        socketStream.end()
        await clientsRules.removeUserRules(clientId)
    })
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



;(async () => {
    await twitterApi.init()
    await twitterApi.deleteAllRules()
    twitterApi.startTweetStream()
    server.listen(3000, () => {
        console.log("API ready and server running on port 3000")
    });
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

