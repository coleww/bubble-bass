# BUBBLE-BASS

A simple lo-fi kinda nintendo-ish bass synth, for use in browserified web audio applications.

## WIKI

`npm install bubble-bass`

## USE
```
window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()
var bass = require('bubble-bass')(ac)
bass.connect(ac.destination)

// set the frequency/ADSR/detune
bass.update({midiNote: 72, attack: 0.3, decay: 0.1, sustain: 0.3, release: 0.5, detune: 7})
// and trigger it!
bass.start(ac.currentTime)


// destroy the oscillators completely. u probably would only wanna do this for garbage collection porpoises.
bass.stop(ac.currentTime)


// this will return an object containing all the nodes in the bubble-bass audioGraph, for closer-to-the-metal manipulation than the update/start methods provide.
bass.nodes() 
```

# DEVELOPMENT

```
npm install
npm run test # should pass! Yay!
```

# HEAR THE MAGIC!

- `npm run serve` boot a webserver at port 3000
- `npm run build` build demo.js to a bundle. Run this after making any changes to hear updates (or add [watchify](https://github.com/wham-js/web-audio-advent-calendar/blob/master/package.json#L8), i wanted to keep things "light")
- open `http://localhost:3000/` in a web browser and hear the magic (hopefully)

# RESOURCES


- [openmusic](https://github.com/openmusic) has a ton of helpful modules
- if you need a basic convolver impulse, [voila](https://github.com/mdn/voice-change-o-matic/tree/gh-pages/audio)