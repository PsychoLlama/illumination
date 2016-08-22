import Update from './index';
import { describe, it, beforeEach } from 'mocha';
import expect from 'expect';

describe('An update', () => {
	let update;

	beforeEach(() => (update = new Update()));

	describe('`on()`', () => {

		it('should return `this`', () => {
			const value = update.on(false);
			expect(value).toBe(update);
		});

		it('should set `on` to the boolean', () => {
			expect(new Update().on(true).toJSON()).toEqual({
				state: { on: true },
			});
			expect(new Update().on(false).toJSON()).toEqual({
				state: { on: false },
			});
		});

	});

	describe('`off()`', () => {

		it('should set `on` to the opposite of it\'s arg', () => {
			expect(new Update().off(true).toJSON()).toEqual({
				state: { on: false },
			});
			expect(new Update().off(false).toJSON()).toEqual({
				state: { on: true },
			});
		});

		it('should return the context', () => {
			expect(update.off(true)).toBe(update);
		});

	});

	describe('`name()`', () => {

		it('should set the name', () => {
			update.name('Living Room');
			expect(update.toJSON().name).toBe('Living Room');
		});

		it('should return the context', () => {
			const result = update.name('hey');
			expect(result).toBe(update);
		});

	});

	describe('`hue()`', () => {

		it('should turn degrees into 0-65mil values', () => {
			update.hue(0);
			expect(update.toJSON().state.hue).toBe(0);

			update.hue(200);
			expect(update.toJSON().state.hue).toBe(36408);

			update.hue(360);
			expect(update.toJSON().state.hue).toBe(0xffff);
		});

		it('should return the context', () => {
			const result = update.hue(5);
			expect(result).toBe(update);
		});

	});

	describe('`sat()`', () => {

		it('should turn percentages into 0-254', () => {
			update.sat(0);
			expect(update.toJSON().state.sat).toBe(0);

			update.sat(1);
			expect(update.toJSON().state.sat).toBe(254);

			update.sat(0.5);
			expect(update.toJSON().state.sat).toBe(127);
		});

		it('should return the context', () => {
			const result = update.sat(0.8);
			expect(result).toBe(update);
		});

	});

	describe('`bri()`', () => {

		it('should turn percents into 1-254 range', () => {
			update.bri(0);
			expect(update.toJSON()).toEqual({
				state: { bri: 1 },
			});

			update.bri(1);
			expect(update.toJSON()).toEqual({
				state: { bri: 254 },
			});

			update.bri(0.5);
			expect(update.toJSON()).toEqual({
				state: { bri: 127 },
			});
		});

		it('should return the context', () => {
			const result = update.bri(0.3);
			expect(result).toBe(update);
		});

	});

	describe('`color()`', () => {

		it('should turn color names into hue/sat/bri', () => {
			update.color('blue');
			expect(update.toJSON().state).toEqual({
				hue: 43690,
				sat: 254,
				bri: 127,
			});
		});

		it('should turn hex codes into hue/sat/bri', () => {
			update.color('#abcdef');
			expect(update.toJSON().state).toEqual({
				hue: 38228,
				sat: 172,
				bri: 204,
			});
		});

		it('should turn rgb() into hue/sat/bri', () => {
			update.color('rgb(50, 75, 100)');
			expect(update.toJSON().state).toEqual({
				hue: 38228,
				sat: 84,
				bri: 75,
			});
		});

		it('should turn hsl() into hue/sat/bri', () => {
			update.color('hsl(200, 75%, 75%)');
			expect(update.toJSON().state).toEqual({
				hue: 36408,
				sat: 190,
				bri: 190,
			});
		});

		it('should return the context', () => {
			const result = update.color('red');
			expect(result).toBe(update);
		});

	});

	describe('`transition()`', () => {

		it('should convert milliseconds', () => {
			update.transition(500);
			expect(update.toJSON()).toContain({
				transitiontime: 5,
			});
		});

		it('should return the context', () => {
			const result = update.transition(300);
			expect(result).toBe(update);
		});

	});

	describe('`colorloop()`', () => {

		it('should start a colorloop', () => {
			update.colorloop(true);
			expect(update.toJSON().effect).toBe('colorloop');
		});

		it('should disable when called with "false"', () => {
			update.colorloop(true);
			update.colorloop(false);
			expect(update.toJSON().effect).toBe('none');
		});

		it('should default to "true"', () => {
			update.colorloop();
			expect(update.toJSON().effect).toBe('colorloop');
		});

		it('should return the context', () => {
			const result = update.colorloop();
			expect(result).toBe(update);
		});

	});

	describe('blink', () => {

		it('should set "alert" to "select"', () => {
			update.blink('once');
			expect(update.toJSON().alert).toBe('select');
		});

		it('should default to "once"', () => {
			update.blink();
			expect(update.toJSON().alert).toBe('select');
		});

		it('should turn "long" into "lselect"', () => {
			update.blink('long');
			expect(update.toJSON().alert).toBe('lselect');
		});

		it('should turn "off" into "none"', () => {
			update.blink('off');
			expect(update.toJSON().alert).toBe('none');
		});

		it('should throw if given bad input', () => {
			expect(() => update.blink('potatoes')).toThrow();
		});

		it('should return the context', () => {
			const result = update.blink();
			expect(result).toBe(update);
		});

	});

});
