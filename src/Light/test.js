import { describe, it } from 'mocha';
import expect from 'expect';
import Light from './index';
import State from '../State';

describe('Light', () => {

	describe('instances', () => {

		it('should expose the state object', () => {
			const light = new Light();
			expect(light.state).toBeA(State);
		});

		it('should import a light object', () => {
			const value = { name: 'Living Room' };
			const light = new Light(value);
			expect(light).toContain(value);
		});

		it('should merge state into a light', () => {
			const light = new Light({
				state: { on: true },
			});

			const state = light.state.toJSON();

			expect(state).toContain({ on: true });
		});

	});

});
