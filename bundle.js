(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./":2}],2:[function(require,module,exports){
var makeDistortionCurve = require('make-distortion-curve')
var MIDIUtils = require('midiutils')

// yr function should accept an audioContext, and optional params/opts
module.exports = function (ac, opts) {
  // make some audioNodes, connect them, store them on the object
  var audioNodes = {}

  var osc1 = ac.createOscillator()
  var osc2 = ac.createOscillator()
  osc1.type = 'square'
  osc2.type = 'square'

  // add some funk to that
  osc1.detune.setValueAtTime(-Math.random(), ac.currentTime)
  osc2.detune.setValueAtTime(Math.random(), ac.currentTime)

  var ldistortion = ac.createWaveShaper()
  ldistortion.curve = makeDistortionCurve(850 + ~~(Math.random() * 450))
  ldistortion.oversample = '4x'

  var rdistortion = ac.createWaveShaper()
  rdistortion.curve = makeDistortionCurve(850 + ~~(Math.random() * 450))
  rdistortion.oversample = '4x'

  var leftfilter = ac.createBiquadFilter()
  leftfilter.type = 'lowpass'
  leftfilter.Q.value = 15
  leftfilter.frequency.setValueAtTime(500, ac.currentTime)

  var rightfilter = ac.createBiquadFilter()
  rightfilter.type = 'lowpass'
  rightfilter.Q.value = 15
  rightfilter.frequency.setValueAtTime(500, ac.currentTime)

  var compressor = ac.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 50
  compressor.ratio.value = 18
  compressor.reduction.value = -5
  compressor.attack.value = 0.05
  compressor.release.value = 0.05

  var pregain = ac.createGain()
  pregain.gain.setValueAtTime(0.7, ac.currentTime)
//
  var oscsine = ac.createOscillator()
  oscsine.type = 'sine'
  var delay = ac.createDelay(0.1)
  var sinedist = ac.createWaveShaper()
  sinedist.curve = makeDistortionCurve(1000)
  var delay2 = ac.createDelay(0.13)
  var sinegain = ac.createGain()
  sinegain.gain.setValueAtTime(0.25, ac.currentTime)
//
  var mainfilter = ac.createBiquadFilter()
  mainfilter.type = 'lowshelf'
  mainfilter.Q.value = 20
  mainfilter.frequency.setValueAtTime(500, ac.currentTime)

  var finaldist = ac.createWaveShaper()
  finaldist.curve = makeDistortionCurve(1000)
  finaldist.oversample = '4x'
  var delay2 = ac.createDelay(0.23)

  var maingain = ac.createGain()
  maingain.gain.setValueAtTime(0, ac.currentTime)



//
  osc1.connect(ldistortion)
  ldistortion.connect(leftfilter)
  leftfilter.connect(compressor)
//
  osc2.connect(rdistortion)
  rdistortion.connect(rightfilter)
  rightfilter.connect(compressor)
//
  compressor.connect(pregain)
//
  oscsine.connect(delay)
  delay.connect(sinedist)
  oscsine.connect(sinedist)
  sinedist.connect(delay2)
  delay2.connect(sinegain)
  sinedist.connect(sinegain)
//
  pregain.connect(mainfilter)
  sinegain.connect(mainfilter)
  mainfilter.connect(maingain)

  audioNodes.osc1 = osc1
  audioNodes.osc2 = osc2
  audioNodes.oscsine = oscsine
  audioNodes.ldistortion = ldistortion
  audioNodes.rdistortion = rdistortion
  audioNodes.leftfilter = leftfilter
  audioNodes.rightfilter = rightfilter
  audioNodes.mainfilter = mainfilter
  audioNodes.maingain = maingain
  audioNodes.pregain = pregain
  audioNodes.sinegain = sinegain
  audioNodes.delay = delay
  audioNodes.delay2 = delay2
  audioNodes.sinedist = sinedist
  audioNodes.compressor = compressor

  // gosh i wish there was an audioNode that just did this...
  audioNodes.settings = {
    attack: 0.1,
    decay: 0.05,
    sustain: 0.3,
    release: 0.1,
    detune: 1,
    chord: false // TODO: build chords instead of playing huge notes as an option?
  }

  return {
    connect: function (input) {
      // // this function should call `connect` on yr output nodes with `input` as the arg
      audioNodes.maingain.connect(input)

      // just let them buzz forever, deal with "notes" via adsr tricks
      audioNodes.osc1.start(ac.currentTime)
      audioNodes.osc2.start(ac.currentTime)
      audioNodes.oscsine.start(ac.currentTime)
    },
    start: function (when) {
      audioNodes.maingain.gain.linearRampToValueAtTime(audioNodes.settings.sustain + 0.2, when + audioNodes.settings.attack)
      audioNodes.maingain.gain.linearRampToValueAtTime(audioNodes.settings.sustain, when + audioNodes.settings.decay)
      audioNodes.maingain.gain.linearRampToValueAtTime(0, when + audioNodes.settings.release)
    },
    stop: function (when) {
      audioNodes.osc1.stop(when)
      audioNodes.osc2.stop(when)
      audioNodes.oscsine.stop(when)
      console.log('whyd u let the bass go? gotta catch a new one now!!!!')
    },
    update: function (opts, when) {
      // available opts:
      // {midiNote: 62, attack: , decay: , sustain: , release: }
      Object.keys(opts).forEach(function (k) {
        var v = opts[k]
        if (k == 'midiNote' || k == 'freq') {
          var freq = k == 'midiNote' ? MIDIUtils.noteNumberToFrequency(v) : v
          audioNodes.leftfilter.frequency.linearRampToValueAtTime(freq + (freq / (2 + Math.random())), when + Math.random())
          audioNodes.rightfilter.frequency.linearRampToValueAtTime(freq + (freq / (2 + Math.random())), when + Math.random())
          audioNodes.mainfilter.frequency.linearRampToValueAtTime(freq - (freq / (1.5 + Math.random())), when + Math.random())

          audioNodes.osc1.frequency.setValueAtTime(freq / 4.0, when)
          audioNodes.osc2.frequency.setValueAtTime(freq / 4.0, when)
          audioNodes.oscsine.frequency.setValueAtTime(freq / 4.0, when)
          // add some funk to that
          audioNodes.osc1.detune.setValueAtTime(audioNodes.settings.detune * -Math.random(), when)
          audioNodes.osc2.detune.setValueAtTime(audioNodes.settings.detune * Math.random(), when)
        } else {
          // just an ADSR value
          audioNodes.settings[k] = v
        }
      })
    },
    nodes: function () {
      // returns an object of `{stringKey: audioNode}` for raw manipulation
      return audioNodes
    }
  }
}
},{"make-distortion-curve":3,"midiutils":4}],3:[function(require,module,exports){
module.exports = function(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}

},{}],4:[function(require,module,exports){
(function() {

	var noteMap = {};
	var noteNumberMap = [];
	var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];


	for(var i = 0; i < 127; i++) {

		var index = i,
			key = notes[index % 12],
			octave = ((index / 12) | 0) - 1; // MIDI scale starts at octave = -1

		if(key.length === 1) {
			key = key + '-';
		}

		key += octave;

		noteMap[key] = i;
		noteNumberMap[i] = key;

	}


	function getBaseLog(value, base) {
		return Math.log(value) / Math.log(base);
	}


	var MIDIUtils = {

		noteNameToNoteNumber: function(name) {
			return noteMap[name];
		},

		noteNumberToFrequency: function(note) {
			return 440.0 * Math.pow(2, (note - 69.0) / 12.0);
		},

		noteNumberToName: function(note) {
			return noteNumberMap[note];
		},

		frequencyToNoteNumber: function(f) {
			return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69);
		}

	};


	// Make it compatible for require.js/AMD loader(s)
	if(typeof define === 'function' && define.amd) {
		define(function() { return MIDIUtils; });
	} else if(typeof module !== 'undefined' && module.exports) {
		// And for npm/node.js
		module.exports = MIDIUtils;
	} else {
		this.MIDIUtils = MIDIUtils;
	}


}).call(this);


},{}]},{},[1]);
