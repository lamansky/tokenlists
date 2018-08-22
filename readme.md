# tokenlists

A collection of wrapper classes that functionally extend [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) and [`relList`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/relList) in a DOM [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element).

These classes add the following features which the native [`DOMTokenList`](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) lacks:
1. Can accept tokens with spaces. Instead of throwing an error, will instead consider such input to be a space-separated list.
2. Can accept multiple tokens by means of multiple parameters, arrays, nested arrays, space-separated lists, or any combination thereof.
3. Supports toggling, replacing, and checking the existence of multiple tokens at once.
4. Permits chained function calls when possible.

## Installation

Requires [Node.js](https://nodejs.org/) 8.3.0 or above.

```bash
npm i tokenlists
```

## API

The module exports an object containing three classes: `ClassList`, `RelList`, and `TokenList`.

```javascript
const {ClassList, RelList, TokenList} = require('tokenlists')
```

Each class can also be `require`d individually.

```javascript
const ClassList = require('tokenlists/class')
const RelList = require('tokenlists/rel')
const TokenList = require('tokenlists/token')
```

`TokenList` is the class on which the other two are based. You probably won’t need to use `TokenList` directly.

### Constructors

The constructors for all of the classes each accept one argument:

* The `TokenList` constructor accepts a [`DOMTokenList`](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList).
* The `ClassList` constructor accepts an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element).
* The `RelList` constructor accepts a DOM element with `relList` support (such as [`HTMLAnchorElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement)).

### Methods

All three classes have the same methods.

In the function definitions below, the `...tokens` parameter is a [rest parameter](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/rest_parameters) that will accept any number of arguments. These arguments can be strings (including space-separated strings) or string arrays (including nested arrays).

* **has (...tokens)**
  * Will return true only if all tokens are present.
* **hasAny (...tokens)**
  * Will return true if at least one token is present.
* **add (...tokens)**
* **remove (...tokens)**
* **removeIf (callback)**
* **removeAll()**
* **removeAllExcept (...permittedTokens)**
* **replace (oldItems, newItems)**
  * `oldItems`: A string or array of tokens.
  * `newItems`: A string or array of tokens.
  * If all the `oldItems` are present, they are removed and replaced with `newItems`.
* **toggle (...tokens)**
  * For each given item, removes it if it’s present, and adds it if not. Each item is toggled independently of the others.
* **toggleTogether (...tokens)**
  * If all given tokens are present, removes all of them. Otherwise adds any that are not present. Ensures that no item is present or absent without the others.
* **if (condition, thenItems, [elseItems])**
  * `condition`: A boolean that determines whether or not the tokens should be present.
  * `thenItems`: A string or array of tokens.
  * `elseItems`: A string or array of tokens.
  * If `condition` is `true`, removes `elseItems` and adds `thenItems`. Otherwise removes `thenItems` and adds `elseItems`.
* **item (index)**
* **length**
