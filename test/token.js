'use strict'

const assert = require('assert')
const DOMTokenList = require('tokenlist')
const {TokenList} = require('..')

function createDOMTokenList () {
  let tokens = ''
  return DOMTokenList(
    () => tokens,
    value => { tokens = value }
  )
}

describe('TokenList', function () {
  it('should throw an error trying to use a non-DOMTokenList', function () {
    assert.throws(() => {
      const tokens = new TokenList({})
      tokens.add('test')
    })
  })

  describe('#has()', function () {
    it('should return true if single token is present', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test')
      assert(tokens.has('test'))
    })

    it('should return true if multiple tokens are all present', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test1')
      tokens.add('test2')
      assert(tokens.has('test1', 'test2'))
    })

    it('should return false if only some tokens are present', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test1')
      assert(!tokens.has('test1', 'test2'))
    })
  })

  describe('#hasAny()', function () {
    it('should return true if single token is present', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test')
      assert(tokens.hasAny('test'))
    })

    it('should return true if at least one token is present', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test1')
      assert(tokens.hasAny('test1', 'test2'))
    })
  })

  describe('#add()', function () {
    it('should add a single token', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test')
      assert(tl.contains('test'))
    })

    it('should add multiple tokens', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1', 'test2')
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
    })

    it('should add an array of tokens', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add(['test1', 'test2'])
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
    })

    it('should add a nested array of tokens', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1', ['test2', ['test3', 'test4']])
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
      assert(tl.contains('test3'))
      assert(tl.contains('test4'))
      assert(!tl.contains('sanitycheck'))
    })

    it('should add string-separated tokens', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('   test1 test2', ['test3   test4'])
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
      assert(tl.contains('test3'))
      assert(tl.contains('test4'))
      assert(!tl.contains('sanitycheck'))
    })

    it('should throw TypeError trying to add a non-string token', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      assert.throws(() => { tokens.add({}) }, TypeError)
    })
  })

  describe('#remove()', function () {
    it('should remove a single token', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test')
      assert(tl.contains('test'))
      tokens.remove('test')
      assert(!tl.contains('test'))
    })

    it('should remove multiple tokens', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1', 'test2')
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
      tokens.remove(['test1', 'test2'])
      assert(!tl.contains('test1'))
      assert(!tl.contains('test2'))
    })

    it('should silently fail removing a non-existent token', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.remove('test')
    })
  })

  describe('#toggle()', function () {
    it('should add a non-existent token', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.toggle('test')
      assert(tl.contains('test'))
    })

    it('should remove an existing token', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test')
      assert(tl.contains('test'))
      tokens.toggle('test')
      assert(!tl.contains('test'))
    })

    it('should toggle multiple tokens independently', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1')
      assert(tl.contains('test1'))
      assert(!tl.contains('test2'))
      tokens.toggle('test1', 'test2')
      assert(!tl.contains('test1'))
      assert(tl.contains('test2'))
    })
  })

  describe('#toggleTogether()', function () {
    it('should add all non-existent tokens if only some exist', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1')
      assert(tl.contains('test1'))
      tokens.toggleTogether('test1', 'test2', 'test3')
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
      assert(tl.contains('test3'))
    })

    it('should remove all tokens if all exist', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1')
      tokens.add('test2')
      assert(tl.contains('test1'))
      assert(tl.contains('test2'))
      tokens.toggleTogether('test1', 'test2')
      assert(!tl.contains('test1'))
      assert(!tl.contains('test2'))
    })
  })

  describe('#if()', function () {
    it('should add first set of tokens if the condition is true', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.if(true, 'test1', 'test2')
      assert(tl.contains('test1'))
      assert(!tl.contains('test2'))
    })

    it('should add second set of tokens if the condition is false', function () {
      const tl = createDOMTokenList()
      const tokens = new TokenList(tl)
      tokens.add('test1')
      assert(tl.contains('test1'))
      assert(!tl.contains('test2'))
      tokens.if(false, 'test1', 'test2')
      assert(!tl.contains('test1'))
      assert(tl.contains('test2'))
    })
  })

  describe('#item()', function () {
    it('should return the token at a given index', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test')
      assert.strictEqual(tokens.item(0), 'test')
    })

    it('should return null for an undefined index', function () {
      const tokens = new TokenList(createDOMTokenList())
      assert.strictEqual(tokens.item(0), null)
    })
  })

  describe('#length', function () {
    it('should return the number of tokens in the list', function () {
      const tokens = new TokenList(createDOMTokenList())
      tokens.add('test1')
      tokens.add('test2')
      assert.strictEqual(tokens.length, 2)
    })
  })
})
