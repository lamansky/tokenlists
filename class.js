'use strict'

const TokenList = require('./token')

const _element = Symbol('element')

module.exports = class ClassList extends TokenList {
  constructor (element) {
    super(element.classList)
    this[_element] = element
  }

  removeAll () {
    this[_element].className = ''
    return this
  }
}
