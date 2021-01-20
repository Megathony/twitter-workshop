const stream = require('stream')
const http = require('https')
const needle = require('needle')
const querystring = require('querystring')

const twitterApi = {
    TWT_API_HOST: "api.twitter.com",
    BEARER: process.env.TWITTER_BEARER_TOKEN,
    req: null,
    rules: [],
    query: {
        'tweet.fields': 'geo,text,author_id',
        'place.fields' : 'id,geo,name,country',
        'expansions': 'geo.place_id'
    },
    get queryString () {
        return querystring.encode(this.query)
    },

    async init () {
        await this.fetchRules()
    },

    tweetStream: new stream.Readable({
        read () {},
    }),
    startTweetStream () {
        const options = {
            hostname: this.TWT_API_HOST,
            path: '/2/tweets/search/stream?' + this.queryString,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        }

        this.req = http.request(options, res => {
            res.on('data', chunk => {
                this.tweetStream.push(chunk.toString())
            })
        })
    },

    async fetchRules () {
        const result = await needle('get', 'https://' + this.TWT_API_HOST + '/2/tweets/search/stream/rules', {
            headers: {
                Authorization: `Bearer ${this.BEARER}`
            }
        })

        if (result.body.data) {
            this.rules = result.body.data
        }
    },

    async addRules (add) {
        if (!Array.isArray(add)) {
            add = [ add ]
        }

        const result = await needle('post', 'https://' + this.TWT_API_HOST + '/2/tweets/search/stream/rules', {
            add
        }, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${this.BEARER}`
            }
        })
        if (result.body.data) {
            this.rules = this.rules.concat(result.body.data)
        }
        return result
    },

    async deleteAllRules () {
        if (this.ids.length) {
            const data = {
                "delete": {
                    "ids": this.ids
                }
            }

            const rulesURL = 'https://' + this.TWT_API_HOST + '/2/tweets/search/stream/rules'

            const response = await needle('post', rulesURL, data, {headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${this.BEARER}`
                }})
            return response.body
        }
        return null
    },

    closeConnection () {
        this.req?.end()
    },
    get ids () {
        return this.rules.map(rule => rule.id)
    }
}

module.exports = twitterApi
