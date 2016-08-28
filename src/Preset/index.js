import Light from '../Light';
const list = Symbol('lights');

/**
 * Create a list of light states.
 *
 * @class {Preset}
 * @param {Object} [lights] - A table of light objects
 * (such as an api response from /lights).
 */
export default class Preset {
	constructor (lights = {}) {
		this[list] = {};

		/** Turn presets into lists of lights. */
		if (lights instanceof Preset) {
			lights = lights[list];
		}

		/** Add each light to the list. */
		Object.entries(lights).forEach(([key, value]) => {
			this[list][key] = new Light(value);
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
		this[list][index] = light;

		return this;
	}

	/**
	 * Return a list of light IDs.
	 *
	 * @returns {String[]} - The light IDs belonging to the preset.
	 */
	keys () {
		const lights = this[list];
		return Object.keys(lights);
	}

	/**
	 * Get a light corresponding to an index.
	 *
	 * @param  {String} index - A light index.
	 * @returns {Light|null} - A light if one is found.
	 */
	'get' (index) {
		return this[list][index] || null;
	}

	/**
	 * Iterate over each light in the preset.
	 *
	 * @param  {Function} callback - Called for each light in the
	 * preset, given the light, lightID, and the preset itself.
	 * @returns {this} - The context.
	 */
	each (callback) {

		/** Iterate over each light ID. */
		this.keys().forEach((key) => {

			/** Get the light. */
			const light = this.get(key);

			/** Call the callback. */
			callback(light, key, this);
		});

		return this;
	}

	/**
	 * Sets the color across the entire preset.
	 *
	 * @param  {Mixed} color - Any CSS color expression.
	 * @returns {this} - The context.
	 */
	color (color) {

		/** Set the color for each light. */
		this.each(({ state }) => state.color(color));

		return this;
	}

	/**
	 * Turn a preset into a serializable structure.
	 *
	 * @private
	 * @returns {Object} - The list of lights.
	 */
	toJSON () {
		return this[list];
	}
}
