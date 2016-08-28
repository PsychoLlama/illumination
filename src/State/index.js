import color from 'tinycolor2';
const update = Symbol('light state');

const blinkStates = {
	off: 'none',
	once: 'select',
	long: 'lselect',
};

/**
 * Easier interface for hue state objects.
 *
 * @param {Object} [source] - A hue state object (as found
 * in a bridge /lights response).
 * @class State
 */
export default class State {

	constructor (source = {}) {
		this[update] = {};

		/** Remove troublesome properties. */
		Object.keys(source).filter((key) => (
			key !== 'ct' &&
			key !== 'xy' &&
			key !== 'alert' &&
			key !== 'reachable' &&
			key !== 'colormode'
		)).forEach((key) => {

			/** Add each key to the state. */
			this[update][key] = source[key];
		});

	}

	/**
	 * Set whether the light is on.
	 *
	 * @param  {Boolean} on=true - Whether or not the light should
	 * be on.
	 * @returns {this} - The context.
	 */
	on (on = true) {
		this[update].on = Boolean(on);

		return this;
	}

	/**
	 * Set whether the light is off.
	 *
	 * @param  {Boolean} off - Whether or not the light should be off.
	 * @returns {this} - The context.
	 */
	off (off = true) {
		return this.on(!off);
	}

	/**
	 * Set the color hue a light should be.
	 *
	 * @param  {Number} degrees - A number from 0-360, representing
	 * the degrees on a color wheel.
	 * @returns {this} - The context.
	 */
	hue (degrees) {

		/** Find the degree percentage. */
		const percent = degrees / 360;

		/** Multiply it by the maximum hue value. */
		const hex = Math.floor(percent * 0xffff);
		this[update].hue = hex;

		return this;
	}

	/**
	 * Set the color saturation.
	 *
	 * @param  {Float} percent - A number from 0 to 1.
	 * @returns {this} - The context.
	 */
	sat (percent) {
		const sat = Math.floor(percent * 254);
		this[update].sat = sat;

		return this;
	}

	/**
	 * Set the brightness of a light.
	 *
	 * @param  {Float} percent - A number between 0 and 1.
	 * @returns {this} - The context.
	 */
	bri (percent) {

		/** Turn it into a number from 1 to 254. */
		const bri = Math.floor(percent * 253) + 1;
		this[update].bri = bri;

		return this;
	}

	/**
	 * Set the color (de-sugars to hue(), sat(), bri()).
	 *
	 * @param  {String} value - Pretty much any color expression
	 * you can use in CSS.
	 * @returns {this} - The context.
	 */
	color (value) {

		/** Turn the expression into an HSL value. */
		const hsl = color(value).toHsl();

		/** Set the hue, saturation, and brightness. */
		this.hue(hsl.h);
		this.sat(hsl.s);
		this.bri(hsl.l);

		return this;
	}

	/**
	 * Set the update transition time.
	 *
	 * @param  {Number} ms - The time in milliseconds. Lights default
	 * to 400ms.
	 * @returns {this} - The context.
	 */
	transition (ms) {
		const time = ms / 100;
		this[update].transitiontime = time;

		return this;
	}

	/**
	 * Enable a light effect.
	 *
	 * @param  {Boolean} bool=true - Whether to turn on the colorloop.
	 * @returns {this} - The context.
	 */
	colorloop (bool = true) {

		const state = this[update];

		if (bool) {
			state.effect = 'colorloop';
		} else {
			state.effect = 'none';
		}

		return this;
	}

	/**
	 * Blinks the lights.
	 *
	 * @throws {TypeError} - If an invalid string is given.
	 * @param  {String} type='once' - Can be "once", "long", or "off".
	 * @returns {this} - The context.
	 */
	blink (type = 'once') {
		const alert = blinkStates[type];

		if (alert) {
			this[update].alert = alert;

			return this;
		}

		throw new TypeError(
			`Expected "once", "long", or "off", got "${type}".`
		);
	}

	/**
	 * Gives a serializable value to JSON.stringify. Called
	 * under the hood by JSON.
	 *
	 * @private
	 * @returns {Object} - The state update.
	 */
	toJSON () {
		return this[update];
	}
}
