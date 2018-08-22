'use strict'

const assert = require('assert')
const DOMTokenList = require('tokenlist')
const {RelList} = require('..')

class HTMLElement {
  constructor () {
    this.rel = ''
    this.relList = DOMTokenList(
      () => this.rel,
      value => { this.rel = value }
    )
  }
}

describe('RelList', function () {
  describe('#has()', function () {
    it('should return true if single class is present', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test')
      assert(rels.has('test'))
    })

    it('should return true if multiple rels are all present', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test1')
      rels.add('test2')
      assert(rels.has('test1', 'test2'))
    })

    it('should return false if only some rels are present', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test1')
      assert(!rels.has('test1', 'test2'))
    })
  })

  describe('#hasAny()', function () {
    it('should return true if single class is present', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test')
      assert(rels.hasAny('test'))
    })

    it('should return true if at least one class is present', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test1')
      assert(rels.hasAny('test1', 'test2'))
    })
  })

  describe('#add()', function () {
    it('should add a single class', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test')
      assert.strictEqual(element.rel, 'test')
    })

    it('should add multiple rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1', 'test2')
      assert.strictEqual(element.rel, 'test1 test2')
    })

    it('should add an array of rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add(['test1', 'test2'])
      assert.strictEqual(element.rel, 'test1 test2')
    })

    it('should add a nested array of rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1', ['test2', ['test3', 'test4']])
      assert.strictEqual(element.rel, 'test1 test2 test3 test4')
    })

    it('should add string-separated rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('   test1 test2', ['test3   test4'])
      assert.strictEqual(element.rel, 'test1 test2 test3 test4')
    })

    it('should throw TypeError trying to add a non-string rel', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      assert.throws(() => { rels.add({}) }, TypeError)
    })
  })

  describe('#remove()', function () {
    it('should remove a single class', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test')
      assert.strictEqual(element.rel, 'test')
      rels.remove('test')
      assert.strictEqual(element.rel, '')
    })

    it('should remove multiple rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1', 'test2')
      assert.strictEqual(element.rel, 'test1 test2')
      rels.remove(['test1', 'test2'])
      assert.strictEqual(element.rel, '')
    })

    it('should silently fail removing a non-existent class', function () {
      const rels = new RelList(new HTMLElement())
      rels.remove('test')
    })
  })

  describe('#removeAll()', function () {
    it('should remove all rels', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1', 'test2')
      assert.strictEqual(element.rel, 'test1 test2')
      rels.removeAll()
      assert.strictEqual(element.rel, '')
      assert.strictEqual(element.relList.length, 0)
    })
  })

  describe('#toggle()', function () {
    it('should add a non-existent class', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.toggle('test')
      assert.strictEqual(element.rel, 'test')
    })

    it('should remove an existing class', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test')
      assert.strictEqual(element.rel, 'test')
      rels.toggle('test')
      assert.strictEqual(element.rel, '')
    })

    it('should toggle multiple rels independently', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1')
      assert.strictEqual(element.rel, 'test1')
      rels.toggle('test1', 'test2')
      assert.strictEqual(element.rel, 'test2')
    })
  })

  describe('#toggleTogether()', function () {
    it('should add all non-existent rels if only some exist', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1')
      assert.strictEqual(element.rel, 'test1')
      rels.toggleTogether('test1', 'test2', 'test3')
      assert.strictEqual(element.rel, 'test1 test2 test3')
    })

    it('should remove all rels if all exist', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1')
      rels.add('test2')
      assert.strictEqual(element.rel, 'test1 test2')
      rels.toggleTogether('test1', 'test2')
      assert.strictEqual(element.rel, '')
    })
  })

  describe('#if()', function () {
    it('should add first set of rels if the condition is true', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.if(true, 'test1', 'test2')
      assert.strictEqual(element.rel, 'test1')
    })

    it('should add second set of rels if the condition is false', function () {
      const element = new HTMLElement()
      const rels = new RelList(element)
      rels.add('test1')
      assert.strictEqual(element.rel, 'test1')
      rels.if(false, 'test1', 'test2')
      assert.strictEqual(element.rel, 'test2')
    })
  })

  describe('#item()', function () {
    it('should return the class at a given index', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test')
      assert.strictEqual(rels.item(0), 'test')
    })

    it('should return null for an undefined index', function () {
      const rels = new RelList(new HTMLElement())
      assert.strictEqual(rels.item(0), null)
    })
  })

  describe('#length', function () {
    it('should return the number of rels in the list', function () {
      const rels = new RelList(new HTMLElement())
      rels.add('test1')
      rels.add('test2')
      assert.strictEqual(rels.length, 2)
    })
  })
})
