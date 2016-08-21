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

	describe('`hue()`', () => {

		it('should turn degrees into 0-65mil values', () => {
			light.hue(0);
			expect(light.toJSON().state.hue).toBe(0);

			light.hue(200);
			expect(light.toJSON().state.hue).toBe(36408);

			light.hue(360);
			expect(light.toJSON().state.hue).toBe(0xffff);
		});

		it('should return the context', () => {
			const result = light.hue(5);
			expect(result).toBe(light);
		});

	});

	describe('`sat()`', () => {

		it('should turn percentages into 0-254', () => {
			light.sat(0);
			expect(light.toJSON().state.sat).toBe(0);

			light.sat(1);
			expect(light.toJSON().state.sat).toBe(254);

			light.sat(0.5);
			expect(light.toJSON().state.sat).toBe(127);
		});

		it('should return the context', () => {
			const result = light.sat(0.8);
			expect(result).toBe(light);
		});

	});

	describe('`bri()`', () => {

		it('should turn percents into 1-254 range', () => {
			light.bri(0);
			expect(light.toJSON()).toEqual({
				state: { bri: 1 },
			});

			light.bri(1);
			expect(light.toJSON()).toEqual({
				state: { bri: 254 },
			});

			light.bri(0.5);
			expect(light.toJSON()).toEqual({
				state: { bri: 127 },
			});
		});

		it('should return the context', () => {
			const result = light.bri(0.3);
			expect(result).toBe(light);
		});

	});

});
