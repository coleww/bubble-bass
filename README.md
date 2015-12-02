# web-audio-synth-template

a template for building web audio synths in a browserify/npm fashion [based on this blog post](http://colewillsea.com/blog/publishing-synthesizers-to-npm.html)

index.js contains a lot of boilerplate commented out code that you can use to yr leisure. 
test.js contains a small test suite that tries to ensure that yr synth or FX is inter-operable with other web audio libraries.

If you don't like the choices I made in index.js, you can still just copy test.js into yr project and `npm install --save-dev tape`


# DEVELOPMENT

```
git clone https://github.com/wham-js/web-audio-synth-template.git
cd web-audio-synth-template
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