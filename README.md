# [UNMAINTAINED] illumination
A small, composable Philips Hue interface for Node and the browser.

[![Travis branch](https://img.shields.io/travis/PsychoLlama/illumination/master.svg?style=flat-square)](https://travis-ci.org/PsychoLlama/illumination)
[![npm](https://img.shields.io/npm/dt/illumination.svg?style=flat-square)](https://www.npmjs.com/package/illumination)
[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/illumination)

## Maintenance Notice
This project is unmaintained. This library didn't actually make anything easier, except changing colors. But there are [better libraries](https://github.com/tdukart/hue-colors) out there.

Instead I've turned my attention to building [filament](https://github.com/PsychoLlama/filament), a GraphQL server for Hue lights.

## Why?
Hue's API is rather unintuitive, and has more baggage than probably needed. For example: there are three ways to set a lamp color:

 - XY - Coordinates in [CIE](https://en.wikipedia.org/wiki/CIE_1931_color_space) color space.
 - Temperature - The degrees in [Mired](https://en.wikipedia.org/wiki/Mired) color space.
 - HSB - Hue, saturation, and brightness.

The most intuitive of the three is HSB (aka HSL, which you've probably used in CSS), but the API implements it differently. Brightness goes from 1-254, saturation from 0-254, and hue from 0-65535. That's a far cry from `hsl(240, 40%, 45%)`.

This library handles some of the rougher edges, using [TinyColor](https://www.npmjs.com/package/tinycolor2) to collapse any CSS color expression into an API-compliant HSB expression.

```javascript
light.state.color('blue')
light.state.color('#00F')
light.state.color('rgb(0, 0, 255)')

// Supports alpha channels, too
light.state.color('#0000FFFF')
```

> **Note:** due to hardware limitations, colors may seem a bit off. Try `yellow` and you'll see what I mean.

Colors are the most obvious, but not the only way Hue's API can be improved...

 - Transition time, measured in second/10 (not milliseconds)
 - Groups (which requires an entirely new API)
 - Scenes (same as groups)

Illumination is created to address these problems, simplifying the hue interface.

It introduces four simpler concepts:

 - States (such as color, alerts/effects, transitions...)
 - Lights (holds state and light information)
 - Presets (Groupings of lights and states)
 - Bridges (for applying presets)

## API
> Illumination is under development, and APIs are subject to change at little more than a whim. Because of that, I haven't invested much into documenting what they do.

> If you want to try it out now, I suggest poking around in the [source code](https://github.com/PsychoLlama/illumination/tree/master/src) - I use JSDoc liberally.

You can install illumination with npm:
```sh
$ npm install illumination --save
```

Then import it (with ES6 modules FTW!)
```javascript
import * as illumination from 'illumination'
```

### State
State is an interface over hue light state, but it doesn't need to be tied to a light.

```javascript
import { State } from 'illumination'
const state = new State()
```

From there, you can start editing the light state. Once you're ready, you add it to a Preset (more on this soon) and submit it to the bridge. If you need to import an existing hue state, you can pass it directly to the constructor.

```javascript
const state = new State({
	hue: 30000,
	sat: 251,
	bri: 101,
})
```

#### Methods
Since the API is changing often, I'm just gonna run through these really quick. Look in the source code for more details.

```javascript
// Blink the light.
state.blink('once')
state.blink('long')
state.blink('off')

// Turn the light on.
state.on(true)
state.on()

// Turn the light off.
state.off(true)
state.off()

// Start a colorloop.
state.colorloop()
// Stop it.
state.colorloop(false)

// Change the color.
state.color('blue')
state.color('#00f')
state.color('rgb(0, 0, 255)')

// Degrees, 0-360.
state.hue(240)
// Percent saturation.
state.sat(0.5)
// Percent brightness.
state.bri(0.2)
```

### Light
This class has no methods. It could be implemented as a function, but, you know, symmetry.

You pass `Light` an object (like one returned from `GET /api/lights/1`) and it copies the metadata onto itself, but upgrades `.state` into a `State` instance.

You'll be able to access the state object from the Light instance like so:

```javascript
const light = new Light({
	state: { hue: 10000 },
	uniqueid: 'bob',
})

light.state.on(true)
```

Like I said, no methods though. Maybe in the future.

### Preset
This is where things get fun! Presets are collections of light states, most comparable to a hue scene (but lightweight).

A preset might be what lights are on at a time, or what colors a group of lights are set to. You can manipulate entire groups at once using some convenience methods.

For example: you might want to create a general preset containing your living room lights, then five more presets that build off it and change the colors and transition times.

```javascript
// Either add them on at once...
const preset = new Preset({
	1: { name: 'Living Room Lamp' },
	2: { name: 'Office Lamp' },
})

// Or add them later.
const light = new Light({
	name: 'Porch Light',
})
preset.add(3, light)
```

#### Methods

```javascript
// Change all colors at once.
preset.color('blue')

// Set transition time.
preset.transition(0)

// Like Object.keys.
preset.keys()

// Adds a new light to the preset.
preset.add(5, new Light)

// Iterate over each light.
preset.each((light, id) => {
	console.log(`Light ${id}`, light)
})
```

### Bridge
Creates a bridge interface that understands presets and has a reasonable api.

No bridge discovery mechanism is included, as I think that would be feature bloat and belongs in a separate module.

Also, it would prevent illumination from being browser friendly.

```javascript
// `ip` is the IP address,
// `key` is the API key.
const bridge = new Bridge(ip, key)
```

#### Methods
The `Bridge` class is fairly new and doesn't have many methods. As needed I'll add some more.

```javascript
// Formats an absolute url
bridge.url('lights', 5)
// Also works with arrays
bridge.url(['lights', 5])

// Resolves to the http response data
bridge.get('lights', 5, 'state')

// Sends preset state to the bridge.
// This is probably what you're looking for.
bridge.apply(new Preset)
```

## Installing from GitHub
I love all the cool toys ES6/7 brings. For now, that means compiling the project through Babel.

```sh
$ git clone https://github.com/PsychoLlama/iillumination.git
$ cd illumination
$ npm install

# `npm run dev` if you're editing.
$ npm run babel
```

To run mocha, do `npm test`.

## Support
If you find a problem, lemme know by filing a GitHub issue. This is a hobby project, but I'll try to follow up asap.

You can support this project and my narcissism by starring it :grinning:
