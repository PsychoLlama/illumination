import Light from './index';
import { describe, it, beforeEach } from 'mocha';
import expect from 'expect';

describe('A light', () => {
	let light;

	beforeEach(() => (light = new Light()));

	describe('`on()`', () => {

		it('should return `this`', () => {
			const value = light.on(false);
			expect(value).toBe(light);
		});

		it('should set `on` to the boolean', () => {
			expect(new Light().on(true).toJSON()).toEqual({
				state: { on: true },
			});
			expect(new Light().on(false).toJSON()).toEqual({
				state: { on: false },
			});
		});

	});

	describe('`off()`', () => {

		it('should set `on` to the opposite of it\'s arg', () => {
			expect(new Light().off(true).toJSON()).toEqual({
				state: { on: false },
			});
			expect(new Light().off(false).toJSON()).toEqual({
				state: { on: true },
			});
		});

		it('should return the context', () => {
			expect(light.off(true)).toBe(light);
		});

	});

	describe('`name()`', () => {

		it('should set the name', () => {
			light.name('Living Room');
			expect(light.toJSON().name).toBe('Living Room');
		});

		it('should return the context', () => {
			const result = light.name('hey');
			expect(result).toBe(light);
		});

	});

});
