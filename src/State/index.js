import color from 'tinycolor2';
const update = Symbol('light state');

export default class State {

	/**
	 * Pull in a hue state and mutate it as an update. Also
	 * works with old update instances.
	 *
	 * @param {Object} source - A bridge api-compliant light
	 * object. Can also be an object from an State instance.
	 * @returns {State} - A new update instance.
	 */
	static 'from' (source) {
		const value = new State();
		value[update] = source;

		return value;
	}

	constructor () {
		this[update] = {};
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
	off (off) {
		return this.on(!off);
	}

	/**
	 * Set the light's name.
	 *
	 * @param  {String} name - The new name of the light.
	 * @returns {this} - The context.
	 */
	name (name) {
		this[update].name = name;

		return this;
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
		let alert;

		switch (type) {
			case 'once':
				alert = 'select';
				break;
			case 'long':
				alert = 'lselect';
				break;
			case 'off':
				alert = 'none';
				break;
			default: throw new TypeError(
				`Expected "once", "long", or "off", got "${type}".`
			);
		}

		this[update].alert = alert;

		return this;
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
