const twitterApi = require('./twitterApi')
const { v4: uuidv4 } = require('uuid')

/**
 * A helper aimed at linking filtering rules to connected clients.
 * It stores the filter rules active on the API, the number of tweets matching these rules and the clients listening for these rules
 */
const clientsRules = {
    rules: [],

    /**
     * Adds filter rules and links them to a client.
     * If one of the rules already exists, adds the client to the existing rule
     * @param rules
     * @param client
     */
    async addRules (rules, client) {
        const newRules = []
        rules.forEach(rule => {
            const existingRule = this.getRuleByValue(rule)
            if (existingRule) {
                existingRule.clients.push(client)
            } else {
                const newRule = {
                    value: rule,
                    clients:  [ client ],
                    numberOfTweets: 0,
                    tag: uuidv4()
                }
                newRules.push(newRule)
            }
        })
        if (newRules.length) {
            const resultRules = await twitterApi.addRules(newRules)
            this.rules = this.rules.concat(newRules)
            return resultRules
        }
        return []
    },

    /**
     * Increments the number of tweets of a rule by 1
     * @param tag
     */
    increment (tag) {
        const rule = this.rules.find(rule => rule.tag === tag)
        if (rule) {
            rule.numberOfTweets++
            return rule
        }
        return false
    },

    /**
     * Gets a rule by its value
     * @param value
     * @returns {*}
     */
    getRuleByValue (value) {
        return this.rules.find(rule => rule.value === value.toLowerCase())
    },
    /**
     * Removes user from clients list of a rule.
     * If the rule is not affected to a client anymore, removes the rule
     * @param userId
     */
    async removeUserRules (userId) {
        const rulesIndexes = this.getUsersRulesIndexes(userId)
        if (rulesIndexes.length) {
            const rulesToRemove = []
            rulesIndexes.forEach(i => {
                const clientIndex = this.rules[i].clients.indexOf(userId)
                if (clientIndex > -1) {
                    this.rules[i].clients.splice(clientIndex, 1)
                }
                if (this.rules[i].clients.length === 0) {
                    rulesToRemove.push(this.rules[i])
                }
            })
            if (rulesToRemove.length) {
                return await this.removeRules(rulesToRemove)
            }
        }
    },

    /**
     * Removes a rule from the local object and syncs this with the API
     * @param rules
     * @returns {Promise<*>}
     */
    async removeRules (rules) {
        const tags = rules.map(rule => rule.tag)
        this.rules = this.rules.filter((rule) => {
            return !tags.includes(rule.tag)
        })
        return await twitterApi.deleteRules({ tags })
    },

    /**
     * Get rules for matching user id
     * @param userId
     */
    getUsersRulesIndexes (userId) {
        const indexes = []
        this.rules.forEach((rule, index) => {
            if (rule.clients.includes(userId)) {
                indexes.push(index)
            }
        })
        return indexes
    }
}

module.exports = clientsRules
