var tap = require('tape')
var window = window || {}
window.AudioContext = window.AudioContext || window.webkitAudioContext || function() {
  return {currentTime: 0}
}
var ac = new window.AudioContext()
var synth = require('./')(ac)

tap.test('conforms to the basic spec', function (t) {
  t.plan(5)
  synth.connect(ac.destination)
  synth.start(ac.currentTime)
  synth.stop(ac.currentTime + 1)
  t.equal(typeof synth.connect, 'function')
  t.equal(typeof synth.start, 'function')
  t.equal(typeof synth.stop, 'function')
  t.equal(typeof synth.nodes, 'function')
  t.equal(typeof synth.nodes(), 'object')
})

// // only needed if making a FX module.
// tap.test('has input function to act as an FX', function (t) {
//   t.plan(1)
//   t.equal(typeof synth.input, 'function')
// })


// // test import/export function. oh, u fancy indeed.
// tap.test('does other stuff', function (t) {
//   t.plan()
//   var data = {} // an object representing the import/export data for yr synth
//   synth.import(data)
//   t.deepEqual(synth.export(), data)
// })
