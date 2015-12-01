var proxy = require('proxyquire')
var test = require('ava')
var sinon = require('sinon')
var path = require('path')
var casual = require('./util').casual

var fakeCallSite
var fakeExistsSync
var fakeSiteGetFileName
var expectedMod
var requiredMod
var requiredModPath
var projectRoot
var callingFilePath
var successfulCall

test.beforeEach(t => {
  expectedMod = casual.object

  requiredModPath = casual.fs_path
  projectRoot = path.sep + casual.fs_path
  callingFilePath = casual.fs_path + '.js'
  successfulCall = path.dirname(callingFilePath).split(path.sep).length

  fakeCallSite = sinon.stub()
  fakeExistsSync = sinon.stub()
  fakeSiteGetFileName = sinon.stub()
  fakeExistsSync.onCall(successfulCall).returns(true)
  fakeSiteGetFileName.returns(path.resolve(projectRoot, callingFilePath))
  fakeCallSite.returns(['...', {getFileName: fakeSiteGetFileName}, '...'])

  requiredMod = proxy.noCallThru()('../index', {
    [path.resolve(projectRoot, requiredModPath)]: expectedMod,
    'callsite': fakeCallSite,
    'fs': {existsSync: fakeExistsSync}
  })(requiredModPath)
})

test('correct module was required', t => {
  t.same(requiredMod, expectedMod)
})

test('stubs are called', t => {
  t.same(fakeCallSite.callCount, 1)
  t.same(fakeSiteGetFileName.callCount, 1)
  t.same(fakeExistsSync.callCount, successfulCall + 1)
})

test('fs.existsSync stub calls', t => {
  path.dirname(callingFilePath).split(path.sep)
    .map((p, i, arr) => {
      return path.resolve(projectRoot, arr.slice(0, arr.length - i).join(path.sep), 'package.json')
    })
    .forEach((packageFile, i, arr) => {
      t.same(fakeExistsSync.getCall(i).args, [packageFile])
    })

  var spyCall = fakeExistsSync.getCall(successfulCall)
  t.same(spyCall.args, [path.resolve(projectRoot, 'package.json')])
})
