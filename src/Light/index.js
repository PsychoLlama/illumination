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
