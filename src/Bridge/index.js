/**
 * Hue bridge interface.
 *
 * @class {Bridge}
 * @param {String} domain - The IP address of the bridge.
 * @param {String} key - An API key for the bridge.
 */
export default class Bridge {
	constructor (domain, key) {
		this.domain = domain;
		this.key = key;
	}

	/**
	 * Format a url to the bridge.
	 *
	 * @param  {...String|Array} [path] - Routes past the root url.
	 * @returns {String} - The formatted url.
	 *
	 * @example
	 * // Pass variadic params...
	 * bridge.url('lights', 10, 'state')
	 * // http://ip/api/your-key/lights/10/state
	 *
	 * // Or use an array.
	 * bridge.url(['lights', 10])
	 * // http://ip/api/your-key/lights/10
	 *
	 * // No arguments work too.
	 * bridge.url()
	 * // http://ip/api/your-key
	 */
	url (path = []) {

		/** Transform variadic args into an array. */
		if (!(path instanceof Array)) {
			path = [...arguments];
		}

		const { domain, key } = this;

		/** Create a url, appending optional routes. */
		const url = [domain, 'api', key, ...path];

		/** Join the url and prefix the http protocol. */
		return `http://${url.join('/')}`;
	}
}
