import { describe, it, beforeEach } from 'mocha';
import expect, { createSpy } from 'expect';
import Preset from './index';
import Light from '../Light';

describe('Preset', () => {
	let preset;
	beforeEach(() => (preset = new Preset()));

	it('should accept an object of lights', () => {
		const preset = new Preset({
			hall: {},
		});

		expect(preset.keys()).toContain('hall');
	});

	it('should turn input into light objects', () => {
		const preset = new Preset({
			hall: { name: 'Hall' },
		});

		const hall = preset.get('hall');
		expect(hall).toBeA(Light);
		expect(hall.name).toBe('Hall');
	});

	it('should accept presets as a light list', () => {
		preset.add('hall', new Light());
		const copy = new Preset(preset);
		expect(copy.keys()).toEqual(preset.keys());
	});

	describe('`.add`', () => {

		it('should add a light to a preset', () => {
			const hall = new Light();
			preset.add('hall', hall);
			expect(preset.keys()).toContain('hall');
		});

		it('should turn POJOs into Light instances', () => {
			const hall = { name: 'Hall' };
			preset.add('hall', hall);
			const result = preset.get('hall');
			expect(result).toBeA(Light);
		});

		it('should copy lights, not reuse', () => {
			const lamp = new Light();
			const red = new Preset().add('lamp', lamp);
			const blue = new Preset().add('lamp', lamp);

			expect(red.get('lamp')).toNotBe(blue.get('lamp'));
		});

		it('should return the context', () => {
			const result = preset.add('light', new Light());
			expect(result).toBe(preset);
		});

	});

	describe('`.get`', () => {

		it('should return `null` if no light is found', () => {
			const result = preset.get('yeti');
			expect(result).toBe(null);
		});

	});

	describe('`.color`', () => {

		it('should set the color of each light', () => {
			preset.add('light', new Light());
			const control = new Light().state.color('blue');
			const state = preset.color('blue').get('light').state;

			expect(state.toJSON()).toEqual(control.toJSON());
		});

		it('should return the context', () => {
			const result = preset.color('#303438');
			expect(result).toBe(preset);
		});

	});

	describe('`.each`', () => {

		beforeEach(() => {
			preset.add('light 1', new Light());
			preset.add('light 2', new Light());
		});

		it('should call the callback for each light', () => {
			const spy = createSpy();
			preset.each(spy);

			expect(spy.calls.length).toBe(2);
		});

		it('should pass the light and ID', () => {
			const spy = createSpy();
			preset.each(spy);
			const key = 'light 1';

			expect(spy).toHaveBeenCalledWith(
				preset.get(key), key, preset
			);
		});

		it('should return the context', () => {
			const result = preset.each(() => {});
			expect(result).toBe(preset);
		});

	});

	describe('`.toJSON`', () => {

		it('should return the list of lights', () => {
			const lights = preset.toJSON();
			const keys = Object.keys(lights);

			expect(keys).toEqual(preset.keys());
		});

	});

});
