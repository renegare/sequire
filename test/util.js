var casual = require('casual')
var path = require('path')

casual.define('object', () => {
  return {
    ['a_' + casual.word]: casual.string,
    ['b_' + casual.word]: casual.string,
    ['c_' + casual.word]: casual.string
  }
})

casual.define('fs_path', () => {
  return casual.array_of_words(casual.integer(1, 10)).join(path.sep)
})

module.exports = {
  casual: casual
}
