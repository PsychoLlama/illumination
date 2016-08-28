import { describe, it, beforeEach } from 'mocha';
import expect from 'expect';
import Bridge from './index';

describe('Bridge', () => {
	let bridge;

	beforeEach(() => {
		bridge = new Bridge('localhost', 'api-key');
	});

	describe('`.url`', () => {

		const root = 'http://localhost/api/api-key';

		it('should format a bridge url', () => {
			const url = bridge.url();
			expect(url).toBe(root);
		});

		it('should append routes to the url', () => {
			const url = bridge.url('lights');
			expect(url).toBe(`${root}/lights`);
		});

		it('should capture variadic arguments', () => {
			const url = bridge.url('lights', 5);
			expect(url).toBe(`${root}/lights/5`);
		});

		it('should accept an array of routes', () => {
			const url = bridge.url(['lights', 5]);
			expect(url).toBe(`${root}/lights/5`);
		});

	});

});
