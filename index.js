
var fs = require('fs'), path = require('path')
var wasm = fs.readFileSync(path.join(__dirname, './varint.wasm'))

var m = new WebAssembly.Module(wasm, )
var instance = new WebAssembly.Instance(m, {})

exports.buffer = new Buffer(instance.exports.memory.buffer)
exports.decode = instance.exports.decode


exports.bytes = instance.exports.bytes
exports.noop = instance.exports.noop
exports.sum = instance.exports.sum



