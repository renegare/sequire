var proxy = require('proxyquire').noCallThru()
var test = require('ava')
var sinon = require('sinon')
var path = require('path')
var casual = require('./util').casual

var requiredModPath = casual.fs_path
var fakeCallSite = sinon.stub()
var fakeExistsSync = sinon.stub()
var fakeSiteGetFileName = sinon.stub()

var projectRoot = path.sep + casual.fs_path
var callingFilePath = casual.fs_path + '.js'

proxy('../index', {
  'callsite': fakeCallSite,
  'fs': {existsSync: fakeExistsSync}
})

var sequire = require('../index')

fakeSiteGetFileName.returns(path.resolve(projectRoot, callingFilePath))
fakeCallSite.returns(['...', {getFileName: fakeSiteGetFileName}, '...'])

test('module not found', t => {
  t.throws(() => {
    sequire(requiredModPath)
  })
})

test('stubs are called', t => {
  t.same(fakeCallSite.callCount, 1)
  t.same(fakeSiteGetFileName.callCount, 1)
  t.same(fakeExistsSync.callCount, path.dirname(path.resolve(projectRoot, callingFilePath)).split(path.sep).length)
})

test('fs.existsSync stub calls', t => {
  path.dirname(callingFilePath).split(path.sep)
    .map((p, i, arr) => {
      return path.resolve(projectRoot, arr.slice(0, arr.length - i).join(path.sep), 'package.json')
    })
    .forEach((packageFile, i, arr) => {
      t.same(fakeExistsSync.getCall(i).args, [packageFile])
    })
})
