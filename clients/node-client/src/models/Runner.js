const bashBridge = require('../bridges/bash')
const consoleBridge = require('../bridges/console')
const readlineBridge = require('../bridges/readline')
const processBridge = require('../bridges/process')
const vm = require('vm')

function Runner(commandArgs, api) {
  this.commandArgs = commandArgs
  this.api = api
}

Runner.prototype.run = function (rail) {
  const context = new vm.createContext({
    Bash: bashBridge(this.commandArgs),
    console: consoleBridge,
    readline: readlineBridge,
    process: processBridge,
  });

  return rail.reduce((promise, flow) => {
    return promise.then(() => {
      return vm.runInContext(flow.code || '', context);
    })
  }, Promise.resolve())
}

module.exports = Runner
