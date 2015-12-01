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
})

test('correct module path is returned', t => {
  var modPath = proxy.noCallThru()('../index', {
    [path.resolve(projectRoot, requiredModPath)]: expectedMod,
    'callsite': fakeCallSite,
    'fs': {existsSync: fakeExistsSync}
  })(requiredModPath, true)

  t.same(modPath, path.resolve(projectRoot, requiredModPath))
})
