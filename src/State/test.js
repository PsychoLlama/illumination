import State from './index';
import { describe, it, beforeEach } from 'mocha';
import expect from 'expect';

describe('State', () => {
	let state;

	beforeEach(() => (state = new State()));

	describe('instances', () => {

		it('should accept light api objects', () => {
			const value = {
				bri: 100,
				name: 'Living Room',
			};
			const state = new State(value);
			expect(state.toJSON()).toEqual(value);
		});

		it('should accept former state instances', () => {
			state.color('blue');
			const copy = JSON.parse(JSON.stringify(state));
			const result = new State(copy);
			expect(state.toJSON()).toEqual(result.toJSON());
		});

		it('should ignore non-hsl color modes', () => {
			const state = new State({
				xy: [1.5, 2.5],
				ct: 123,
				hue: 5,
			});

			expect(state.toJSON()).toEqual({
				hue: 5,
			});
		});

		it('should ignore useless properties', () => {
			const state = new State({
				reachable: true,
				colormode: 'xy',
				alert: 'lselect',
				hue: 5,
			});

			expect(state.toJSON()).toEqual({ hue: 5 });
		});

	});

	describe('`on()`', () => {

		it('should return the context', () => {
			const value = state.on(false);
			expect(value).toBe(state);
		});

		it('should set `on` to the boolean', () => {
			expect(new State().on(true).toJSON()).toEqual({
				on: true,
			});
			expect(new State().on(false).toJSON()).toEqual({
				on: false,
			});
		});

		it('should default to "true"', () => {
			state.on();
			expect(state.toJSON().on).toBe(true);
		});

	});

	describe('`off()`', () => {

		it('should set `on` to the opposite of it\'s arg', () => {
			expect(new State().off(true).toJSON()).toEqual({
				on: false,
			});
			expect(new State().off(false).toJSON()).toEqual({
				on: true,
			});
		});

		it('should default to true', () => {
			state.off();
			expect(state.toJSON().on).toBe(false);
		});

		it('should return the context', () => {
			expect(state.off(true)).toBe(state);
		});

	});

	describe('`hue()`', () => {

		it('should turn degrees into 0-65mil values', () => {
			state.hue(0);
			expect(state.toJSON().hue).toBe(0);

			state.hue(200);
			expect(state.toJSON().hue).toBe(36408);

			state.hue(360);
			expect(state.toJSON().hue).toBe(0xffff);
		});

		it('should return the context', () => {
			const result = state.hue(5);
			expect(result).toBe(state);
		});

	});

	describe('`sat()`', () => {

		it('should turn percentages into 0-254', () => {
			state.sat(0);
			expect(state.toJSON().sat).toBe(0);

			state.sat(1);
			expect(state.toJSON().sat).toBe(254);

			state.sat(0.5);
			expect(state.toJSON().sat).toBe(127);
		});

		it('should return the context', () => {
			const result = state.sat(0.8);
			expect(result).toBe(state);
		});

	});

	describe('`bri()`', () => {

		it('should turn percents into 1-254 range', () => {
			state.bri(0);
			expect(state.toJSON()).toEqual({ bri: 1 });

			state.bri(1);
			expect(state.toJSON()).toEqual({ bri: 254 });

			state.bri(0.5);
			expect(state.toJSON()).toEqual({ bri: 127 });
		});

		it('should return the context', () => {
			const result = state.bri(0.3);
			expect(result).toBe(state);
		});

	});

	describe('`color()`', () => {

		it('should turn color names into hue/sat/bri', () => {
			state.color('blue');
			expect(state.toJSON()).toEqual({
				hue: 43690,
				sat: 254,
				bri: 127,
			});
		});

		it('should turn hex codes into hue/sat/bri', () => {
			state.color('#abcdef');
			expect(state.toJSON()).toEqual({
				hue: 38228,
				sat: 172,
				bri: 204,
			});
		});

		it('should turn rgb() into hue/sat/bri', () => {
			state.color('rgb(50, 75, 100)');
			expect(state.toJSON()).toEqual({
				hue: 38228,
				sat: 84,
				bri: 75,
			});
		});

		it('should turn hsl() into hue/sat/bri', () => {
			state.color('hsl(200, 75%, 75%)');
			expect(state.toJSON()).toEqual({
				hue: 36408,
				sat: 190,
				bri: 190,
			});
		});

		it('should return the context', () => {
			const result = state.color('red');
			expect(result).toBe(state);
		});

	});

	describe('`transition()`', () => {

		it('should convert milliseconds', () => {
			state.transition(500);
			expect(state.toJSON()).toContain({
				transitiontime: 5,
			});
		});

		it('should return the context', () => {
			const result = state.transition(300);
			expect(result).toBe(state);
		});

	});

	describe('`colorloop()`', () => {

		it('should start a colorloop', () => {
			state.colorloop(true);
			expect(state.toJSON().effect).toBe('colorloop');
		});

		it('should disable when called with "false"', () => {
			state.colorloop(true);
			state.colorloop(false);
			expect(state.toJSON().effect).toBe('none');
		});

		it('should default to "true"', () => {
			state.colorloop();
			expect(state.toJSON().effect).toBe('colorloop');
		});

		it('should return the context', () => {
			const result = state.colorloop();
			expect(result).toBe(state);
		});

	});

	describe('blink', () => {

		it('should set "alert" to "select"', () => {
			state.blink('once');
			expect(state.toJSON().alert).toBe('select');
		});

		it('should default to "once"', () => {
			state.blink();
			expect(state.toJSON().alert).toBe('select');
		});

		it('should turn "long" into "lselect"', () => {
			state.blink('long');
			expect(state.toJSON().alert).toBe('lselect');
		});

		it('should turn "off" into "none"', () => {
			state.blink('off');
			expect(state.toJSON().alert).toBe('none');
		});

		it('should throw if given bad input', () => {
			expect(() => state.blink('potatoes')).toThrow();
		});

		it('should return the context', () => {
			const result = state.blink();
			expect(result).toBe(state);
		});

	});

});
