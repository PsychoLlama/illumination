import State from '../State';

/**
 * A hue light interface.
 *
 * @class {Light}
 * @param {Object} [object] - A bridge-compatible light object.
 */
export default class Light {
	constructor (light = {}) {
		Object.assign(this, light);

		const state = light.state || {};
		this.state = new State(state);
	}
}
