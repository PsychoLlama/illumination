import Light from '../Light';

/**
 * Create a list of light states.
 *
 * @class {Preset}
 * @param {Object} [lights] - A table of light objects
 * (such as an api response from /lights).
 */
export default class Preset {
	constructor (lights = {}) {
		this.lights = {};

		/** Add each light to the list. */
		Object.entries(lights).forEach(([key, value]) => {
			this.lights[key] = new Light(value);
		});
	}

	/**
	 * Add a light to the preset.
	 *
	 * @param  {String} index - The light ID.
	 * @param  {Light} object - An object representing
	 * a light.
	 * @returns {this} - The context.
	 */
	add (index, object) {

		/** Ensure `light` is a Light instance. */
		const light = new Light(object);

		/** Add it to the preset. */
		this.lights[index] = light;

		return this;
	}

	/**
	 * Get a light corresponding to an index.
	 *
	 * @param  {String} index - A light index.
	 * @returns {Light|null} - A light if one is found.
	 */
	'get' (index) {
		return this.lights[index] || null;
	}

	/**
	 * Turn a preset into a serializable structure.
	 *
	 * @private
	 * @returns {Object} - The list of lights.
	 */
	toJSON () {
		return this.lights;
	}
}
