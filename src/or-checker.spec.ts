import { expect } from 'chai';
import {number, or, string} from './index';

describe('or-checker', () => {
    it('checks if data is one of provided types', () => {
        expect(
            or(string(), number()) ('qua')
        ).equal(true);

        expect(
            or(number(), string()) ('qua')
        ).equal(true);

        expect(
            or(string(), number()) (-1)
        ).equal(true);

        expect(
            or(number(), string()) (Infinity)
        ).equal(true);

        expect(
            or(string(), number()) (['qua'])
        ).equal(false);

        expect(
            or(number(), string()) (true)
        ).equal(false);

    });
});
