'use strict'

const TokenList = require('./token')

const _element = Symbol('element')

module.exports = class RelList extends TokenList {
  constructor (element) {
    super(element.relList)
    this[_element] = element
  }

  removeAll () {
    this[_element].rel = ''
    return this
  }
}
