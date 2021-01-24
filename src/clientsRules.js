/**
 * Doit stocker les règles
 * Ajouter à chaque règle la liste de ses clients
 * Ajouter une règle à un client -> si elle existe on affecte, sinon on crée puis on affecte
 * vérifier si une règle a un utilisateur donné
 * libérer une règle d'un utilisateur
 * ajouter un tweet à un client
 */

const twitterApi = require('./twitterApi')
const { v4: uuidv4 } = require('uuid')

const rules = twitterApi.rules.map(rule => {
    rule.clients = []
    return rule
})

const clientsRules = {
    rules,
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
    increment (tag) {
        const rule = this.rules.find(rule => rule.tag === tag)
        if (rule) {
            rule.numberOfTweets++
            return rule
        }
        return false
    },
    getRuleByValue (value) {
        return this.rules.find(rule => rule.value === value.toLowerCase())
    },
    /**
     * Remove user from clients list of a rule. If the rule is not affected to a client anymore, remove the rule
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
            // await twitterApi.deleteRules({
            //     tags: rules.map(rule => rule.tag)
            // })
        }
    },

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
