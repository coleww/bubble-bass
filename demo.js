window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()
var synth = require('./')(ac)
// just connect and start the synth to make sure it plays, edit as needed!
synth.connect(ac.destination)




window.setInterval(function () {
  synth.update({midiNote: 60 + ~~(Math.random() * 12), attack: 0.25, decay: 0.1, sustain: 0.7, release: 0.2}, ac.currentTime)
  synth.start(ac.currentTime)

  synth.update({midiNote: 60 + ~~(Math.random() * 12), attack: 0.25, decay: 0.1, sustain: 0.7, release: 0.2}, ac.currentTime + 1)
  synth.start(ac.currentTime + 1)

  synth.update({midiNote: 60 + ~~(Math.random() * 12), attack: 0.25, decay: 0.1, sustain: 0.7, release: 0.2}, ac.currentTime + 2)
  synth.start(ac.currentTime + 2)

  synth.update({midiNote: 60 + ~~(Math.random() * 12), attack: 0.25, decay: 0.1, sustain: 0.7, release: 0.2}, ac.currentTime + 2.5)
  synth.start(ac.currentTime + 2.5)

  synth.update({midiNote: 60 + ~~(Math.random() * 12), attack: 0.25, decay: 0.1, sustain: 0.7, release: 0.2}, ac.currentTime + 3)
  synth.start(ac.currentTime + 3)
}, 4200)
