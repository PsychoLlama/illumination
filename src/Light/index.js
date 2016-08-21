import color from 'tinycolor2';
const light = Symbol('light state');

export default class Light {
	constructor () {
		this[light] = {
			state: {},
		};
	}

	/**
	 * Set whether the light is on.
	 *
	 * @param  {Boolean} on - Whether or not the light should be on.
	 * @returns {this} - The context.
	 */
	on (on) {
		this[light].state.on = Boolean(on);

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
		this[light].name = name;

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
		this[light].state.hue = hex;

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
		this[light].state.sat = sat;

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
		this[light].state.bri = bri;

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
	 * Gives a serializable value to JSON.stringify. Called
	 * under the hood by JSON.
	 *
	 * @private
	 * @returns {Object} - The state update.
	 */
	toJSON () {
		return this[light];
	}
}
