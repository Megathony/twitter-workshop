const stream = require('stream')
const http = require('https')
const needle = require('needle')
const querystring = require('querystring')

/**
 * Twitter custop API wrapper for filtered stream
 */
const twitterApi = {
    TWT_API_HOST: "api.twitter.com",
    BEARER: process.env.TWITTER_BEARER_TOKEN,
    req: null,
    rules: [],

    async init () {
        await this.fetchRules()
    },

    tweetStream: new stream.Readable({
        read () {},
    }),

    /**
     * Start binding incoming tweets to tweetStream
     */
    startTweetStream () {
        const options = {
            hostname: this.TWT_API_HOST,
            path: '/2/tweets/search/stream',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        }

        const req = http.request(options, res => {
            res.on('data', chunk => {
                this.tweetStream.push(chunk.toString())
            })
        })
        req.end()
    },

    /**
     * Fetches the existing filter rules on the API side to sync it with the locally stored rules
     * @returns {Promise<void>}
     */
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

    /**
     * Adds one or many rules to the filter stream
     * @param add Array|Object
     */
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
            return result.body.data
        }
        return []
    },

    /**
     * Deletes rules based on arrays of ids or tags
     * @param rules Object of the form { ids: <array of ids> } | { tags: <array of tags> }
     * @returns {Promise}
     */
    async deleteRules (rules) {
        if (rules.tags) {
            rules.ids = this.tagsToIds(rules.tags)
        }
        const data = {
            "delete": rules
        }

        const rulesURL = 'https://' + this.TWT_API_HOST + '/2/tweets/search/stream/rules'

        const response = await needle('post', rulesURL, data, {headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${this.BEARER}`
            }})
        await this.fetchRules()
        return response.body
    },

    /**
     * Converts an arrays of rules tags to an array of rules ids
     * @param tags
     * @returns {[]}
     */
    tagsToIds (tags) {
        const result = []
        tags.forEach(tag => {
            const rule = this.rules.find(rule => rule.tag === tag)
            if (rule) {
                result.push(rule.id)
            }
        })
        return result
    },

    /**
     * Deletes all filter rules set
     * @returns {Promise<Promise|null>}
     */
    async deleteAllRules () {
        if (this.ids.length) {
            const rules = {
                "ids": this.ids
            }
            return this.deleteRules(rules)
        }
        return null
    },

    /**
     * Get an array of ids form the *rules* array
     * @returns {*[]}
     */
    get ids () {
        return this.rules.map(rule => rule.id)
    }
}

module.exports = twitterApi
