var tokenizer = require('glsl-tokenizer/string')
var depth     = require('glsl-token-depth')
var test      = require('tape')
var path      = require('path')
var scope     = require('../')
var fs        = require('fs')

var src = fs.readFileSync(
  path.join(__dirname, 'fixture.glsl')
, 'utf8')

test('glsl-token-scope: structs', function(t) {
  var tokens = scope(depth(tokenizer(src)))

  eachIdent(tokens, 'Thing', function(ident) {
    t.equal(ident.scope, 0, 'Thing / scope: 0')
    t.deepEqual(ident.stack, [0], 'Thing / stack: [0]')
  })

  eachIdent(tokens, 'thing1', function(ident) {
    t.equal(ident.scope, 1, 'Thing.thing1 / scope: 1')
    t.deepEqual(ident.stack, [0, 1], 'Thing.thing1 / stack: [0, 1]')
  })

  eachIdent(tokens, 'thing2', function(ident) {
    t.equal(ident.scope, 1, 'Thing.thing1 / scope: 1')
    t.deepEqual(ident.stack, [0, 1], 'Thing.thing1 / stack: [0, 1]')
  })

  t.end()
})

test('glsl-token-scope: function declarations', function(t) {
  var tokens = scope(depth(tokenizer(src)))

  eachIdent(tokens, 'main', function(ident) {
    t.equal(ident.scope, 0, 'main / scope: 0')
    t.deepEqual(ident.stack, [0], 'main / stack: [0]')
  })

  t.end()
})

test('glsl-token-scope: for loops', function(t) {
  var tokens = scope(depth(tokenizer(src)))

  eachIdent(tokens, 'loop1', function(ident) {
    t.equal(ident.scope, 5, 'loop1 / scope: 5')
    t.deepEqual(ident.stack, [0, 4, 5], 'loop1 / stack: [0, 4, 5]')
  })

  eachIdent(tokens, 'loop2', function(ident) {
    t.equal(ident.scope, 7, 'loop2 / scope: 7')
    t.deepEqual(ident.stack, [0, 4, 5, 6, 7], 'loop2 / stack: [0, 4, 5, 6, 7]')
  })

  t.end()
})

test('glsl-token-scope: while loops', function(t) {
  var tokens = scope(depth(tokenizer(src)))

  eachIdent(tokens, 'tenth', function(ident, i) {
    switch (i) {
      case 0:
      case 1:
        t.equal(ident.scope, 4, 'tenth / scope: 2')
        t.deepEqual(ident.stack, [0, 4], 'tenth / stack: [0, 4]')
      break
      case 2:
        t.equal(ident.scope, 10, 'tenth / scope: 8')
        t.deepEqual(ident.stack, [0, 4, 10], 'tenth / stack: [0, 4, 10]')
      break
    }
  })

  t.end()
})

function eachIdent(tokens, name, ident) {
  for (var i = 0, j = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'ident') continue
    if (tokens[i].data !== name) continue
    ident(tokens[i], j++)
  }
}
