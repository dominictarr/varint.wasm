var tape = require('tape')

var varint = require('varint')
var v = require('../')

tape('simple', function (t) {

  for(var i = 0; i < 1<<12;i++) {
    varint.encode(i, v.buffer, 1)
    t.equal(v.decode(1, 0), i)
    t.equal(v.buffer[0], varint.encode.bytes)
  }

  for(var c = 1; c +10< v.buffer.length;) {
    varint.encode(i, v.buffer, c)
    c+=varint.encode.bytes
  }
  //wasm
  var start = Date.now(), i = 0
  for(var j = 0; j < 100 ;j++) {
    var sum = 0
    for(var c = 1; c < v.buffer.length;) {
      i++
      sum += v.decode(c, 0)
//        c+=v.bytes()
    c += v.buffer[0]
    }
  }
  console.log(i, sum, Date.now() - start)

  var start = Date.now(), i = 0
  for(var j = 0; j < 100 ;j++) {
    var sum = 0
    for(var c = 1; c < v.buffer.length;) {
      i++
      sum += varint.decode(v.buffer, c)
      c+=varint.decode.bytes
    }
  }
  console.log(i, sum, Date.now() - start)

  var start = Date.now(), i = 0
  for(var j = 0; j < 100 ;j++) {
    var sum  = v.sum(1, 0)
    
//    for(var c = 1; c < v.buffer.length;) {
//      i++
//      sum += varint.decode(v.buffer, c)
//      c+=varint.decode.bytes
//    }
  }
  console.log(i, sum, Date.now() - start)


  t.end()
})

function noop (i) { return i }

tape('js noop', function (t) {
  var sum = 0
  var start = Date.now()
  for(var i = 0; i < 10000000; i++)
    sum += noop(i)
  console.log(Date.now() - start)
  t.end()
})
tape('wasm noop', function (t) {
  var sum = 0
  var start = Date.now()
  for(var i = 0; i < 10000000; i++)
    sum += v.noop(i)
  console.log(Date.now() - start)
  t.end()
})



