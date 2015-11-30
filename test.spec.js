var proxy = require('proxyquire').noCallThru()
var test = require('ava')
var sinon = require('sinon')
var path = require('path')
var casual = require('casual')

casual.define('object', function() {
    return {
        ['a_' + casual.word]: casual.string,
        ['b_' + casual.word]: casual.string,
        ['c_' + casual.word]: casual.string
    };
});

casual.define('fs_path', function() {
    return casual.array_of_words(casual.integer(1, 10)).join(path.sep)
});

var expectedMod = casual.object
var requiredModPath = casual.fs_path
var fakeCallSite = sinon.stub()
var fakeExistsSync = sinon.stub()
var fakeSiteGetFileName = sinon.stub()

var projectRoot = path.sep + casual.fs_path
var callingFilePath = casual.fs_path + '.js'
var successfulCall = path.dirname(callingFilePath).split(path.sep).length

proxy('./index', {
    [path.resolve(projectRoot, requiredModPath)]: expectedMod,
    'callsite': fakeCallSite,
    'fs': {existsSync: fakeExistsSync}
})

var sequire = require('./index')

fakeExistsSync.onCall(successfulCall).returns(true)
fakeSiteGetFileName.returns(path.resolve(projectRoot, callingFilePath))
fakeCallSite.returns(['...', {getFileName: fakeSiteGetFileName}, '...'])

test('correct module was required', t => {
    var mod = sequire(requiredModPath)
    t.same(mod, expectedMod)
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
