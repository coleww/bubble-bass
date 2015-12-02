
// EXAMPLE CODE TO COPY PASTE EVERYWHERE!



// that boilerplate || dance
window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()

// an immortal oscillator, can be start'ed over and over.
var oscillator = require('openmusic-oscillator')

var oscillator = oscillator(ac)
oscillator.type = 'square' // 'triangle', 'sine', 'sawtooth', ? 'custom' ?
oscillator.frequency.value = 440
oscillator.detune.value = 0

var filter = ac.createBiquadFilter()
filter.Q.value = 5
filter.type = 'lowpass' // 'highpass', 'bandpass', 'lowpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'
filter.detune.value = 0

// that one distortion curve that everyone copy pastes from stack overflow anyways
var makeDistortionCurve = require('make-distortion-curve')
// make a distortion pedal! yay!
var distortion = ac.createWaveShaper()
distortion.curve = makeDistortionCurve(100)

// MAKE A DELAY! remember that the delay only outputs the wet signal!
// be certain to like `osc.connect(delay); delay.connect(ac.destination); osc.connect(destination)` to get the full effect! run each side through a gain to get wet/dry controls!
var delay = ac.createDelay(5.0)
delay.delayTime.value = 3.2

// tbh i have never understood what compressors do. This is blindly copy pasta'd, thus the semicolons
var compressor = ac.createDynamicsCompressor();
compressor.threshold.value = -50;
compressor.knee.value = 40;
compressor.ratio.value = 12;
compressor.reduction.value = -20;
compressor.attack.value = 0;
compressor.release.value = 0.25;

// MAKE A REVERB! BOIIIIIIIIIING
var convolver = ac.createConvolver()
// have the user pass a path to a convolution impulse thingy in the opts
loadSample2Buff(ac, path, function(buffer){
    convolver.buffer = buffer
})
convolver.normalize = true // idk what this means whatever


// VOLUME! SAVE YR EARS! throw a gain of 0.3 at the end of yr chain for much pain saving
var gain = ac.createGain()
gain.gain.value = 0.3




// helper for loading audio files into buffers
var loadSample2Buff = require('load-sample-2-buff')
// an immortal buffer player sampler thing
var samplePlayer = require('@coleww/openmusic-sample-player')

// probably have the user path a path in to the function, or tell them to put a certain sample in a place
loadSample2Buff(ac, path, function(buffer){
    player.buffer = buffer
    player.start()
})


oscillator.connect(filter)
filter.connect(ac.destination)
// etc. and so on forever as you please
oscillator.start(ac.currentTime)
// WHEEEEE