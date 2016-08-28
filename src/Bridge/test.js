import { describe, it, beforeEach, afterEach } from 'mocha';
import expect, { spyOn } from 'expect';
import Bridge from './index';
import axios from 'axios';

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

	describe('`.get`', () => {
		const resolved = Promise.resolve({ data: null });
		const spy = spyOn(axios, 'get').andReturn(resolved);

		afterEach(() => spy.reset());

		it('should format the params into a url', () => {
			const url = bridge.url('lights', 5);
			bridge.get('lights', 5);
			expect(spy).toHaveBeenCalledWith(url);
		});

		it('should resolve if the request succeeds', async () => {
			const result = Promise.resolve({ data: 'success' });
			spy.andReturn(result);

			const response = await bridge.get('lights');
			expect(response).toBe('success');
		});

	});

});
