'use strict'

const assert = require('assert')
const DOMTokenList = require('tokenlist')
const {ClassList} = require('..')

class HTMLElement {
  constructor () {
    this.className = ''
    this.classList = DOMTokenList(
      () => this.className,
      value => { this.className = value }
    )
  }
}

describe('ClassList', function () {
  describe('#has()', function () {
    it('should return true if single class is present', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test')
      assert(classes.has('test'))
    })

    it('should return true if multiple classes are all present', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test1')
      classes.add('test2')
      assert(classes.has('test1', 'test2'))
    })

    it('should return false if only some classes are present', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test1')
      assert(!classes.has('test1', 'test2'))
    })
  })

  describe('#hasAny()', function () {
    it('should return true if single class is present', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test')
      assert(classes.hasAny('test'))
    })

    it('should return true if at least one class is present', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test1')
      assert(classes.hasAny('test1', 'test2'))
    })
  })

  describe('#add()', function () {
    it('should add a single class', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test')
      assert.strictEqual(element.className, 'test')
    })

    it('should add multiple classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1', 'test2')
      assert.strictEqual(element.className, 'test1 test2')
    })

    it('should add an array of classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add(['test1', 'test2'])
      assert.strictEqual(element.className, 'test1 test2')
    })

    it('should add a nested array of classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1', ['test2', ['test3', 'test4']])
      assert.strictEqual(element.className, 'test1 test2 test3 test4')
    })

    it('should add string-separated classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('   test1 test2', ['test3   test4'])
      assert.strictEqual(element.className, 'test1 test2 test3 test4')
    })

    it('should throw TypeError trying to add a non-string class', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      assert.throws(() => { classes.add({}) }, TypeError)
    })
  })

  describe('#remove()', function () {
    it('should remove a single class', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test')
      assert.strictEqual(element.className, 'test')
      classes.remove('test')
      assert.strictEqual(element.className, '')
    })

    it('should remove multiple classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1', 'test2')
      assert.strictEqual(element.className, 'test1 test2')
      classes.remove(['test1', 'test2'])
      assert.strictEqual(element.className, '')
    })

    it('should silently fail removing a non-existent class', function () {
      const classes = new ClassList(new HTMLElement())
      classes.remove('test')
    })
  })

  describe('#removeAll()', function () {
    it('should remove all classes', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1', 'test2')
      assert.strictEqual(element.className, 'test1 test2')
      classes.removeAll()
      assert.strictEqual(element.className, '')
      assert.strictEqual(element.classList.length, 0)
    })
  })

  describe('#toggle()', function () {
    it('should add a non-existent class', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.toggle('test')
      assert.strictEqual(element.className, 'test')
    })

    it('should remove an existing class', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test')
      assert.strictEqual(element.className, 'test')
      classes.toggle('test')
      assert.strictEqual(element.className, '')
    })

    it('should toggle multiple classes independently', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1')
      assert.strictEqual(element.className, 'test1')
      classes.toggle('test1', 'test2')
      assert.strictEqual(element.className, 'test2')
    })
  })

  describe('#toggleTogether()', function () {
    it('should add all non-existent classes if only some exist', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1')
      assert.strictEqual(element.className, 'test1')
      classes.toggleTogether('test1', 'test2', 'test3')
      assert.strictEqual(element.className, 'test1 test2 test3')
    })

    it('should remove all classes if all exist', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1')
      classes.add('test2')
      assert.strictEqual(element.className, 'test1 test2')
      classes.toggleTogether('test1', 'test2')
      assert.strictEqual(element.className, '')
    })
  })

  describe('#if()', function () {
    it('should add first set of classes if the condition is true', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.if(true, 'test1', 'test2')
      assert.strictEqual(element.className, 'test1')
    })

    it('should add second set of classes if the condition is false', function () {
      const element = new HTMLElement()
      const classes = new ClassList(element)
      classes.add('test1')
      assert.strictEqual(element.className, 'test1')
      classes.if(false, 'test1', 'test2')
      assert.strictEqual(element.className, 'test2')
    })
  })

  describe('#item()', function () {
    it('should return the class at a given index', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test')
      assert.strictEqual(classes.item(0), 'test')
    })

    it('should return null for an undefined index', function () {
      const classes = new ClassList(new HTMLElement())
      assert.strictEqual(classes.item(0), null)
    })
  })

  describe('#length', function () {
    it('should return the number of classes in the list', function () {
      const classes = new ClassList(new HTMLElement())
      classes.add('test1')
      classes.add('test2')
      assert.strictEqual(classes.length, 2)
    })
  })
})
