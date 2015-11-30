var stack = require('callsite')
var path = require('path')
var fs = require('fs')

module.exports = function Sequire (mod) {
  var callingFile = stack()[1].getFileName()
  var packageFile
  var found = path.dirname(callingFile)
    .split(path.sep)
    .map(path => !path ? '/' : path)
    .some((curr, index, arr) => {
      packageFile = path.resolve(arr.slice(0, arr.length - index).join(path.sep), 'package.json')
      return fs.existsSync(packageFile)
    })

  if (found) {
    mod = path.resolve(path.dirname(packageFile), mod)
  }

  return require(mod)
}
