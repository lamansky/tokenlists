'use strict'

const Listwrap = require('listwrap')
const sanitizeTokens = require('sanitize-tokens')

module.exports = class TokenList extends Listwrap {
  constructor (domTokenList) {
    super({
      add: t => domTokenList.add(t),
      remove: t => domTokenList.remove(t),
      has: t => domTokenList.contains(t),
      item: i => domTokenList.item(i),
      values: () => domTokenList.values(),
      length: () => domTokenList.length,
      sanitize: t => sanitizeTokens(t, {elseThrow: new TypeError('Cannot add a non-string as a token')}),
    })
  }
}
