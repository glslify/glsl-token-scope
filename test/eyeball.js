var tokenize = require('glsl-tokenizer/string')
var chalk    = require('chalk')
var test     = require('tape')
var path     = require('path')
var subscope = require('../')
var fs       = require('fs')
var fixture  = path.resolve(__dirname, 'fixture.glsl')
var src      = fs.readFileSync(fixture, 'utf8')
var tokens   = tokenize(src)

require('../')(require('glsl-token-depth')(tokens))

var colors = {}
var index  = 0
var list   = [
    'blue'
  , 'green'
  , 'red'
  , 'yellow'
  , 'magenta'
  , 'cyan'
]

console.log()
for (var i = 0; i < tokens.length; i++) {
  var token = tokens[i]
  var scope = token.scope
  var color = colors[scope] = colors[scope] || list[index = (index + 1) % list.length]
  var data  = token.data
  if (data === '(eof)') continue

  process.stdout.write(chalk[color](data))
}
console.log()
console.log()
