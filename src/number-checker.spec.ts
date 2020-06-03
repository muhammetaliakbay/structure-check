import { expect } from 'chai';
import {number} from './index';

describe('number-checker', () => {
    it('checks if data is number or not', () => {
        expect(
            number() (-1)
        ).equal(true);

        expect(
            number() (NaN)
        ).equal(true);

        expect(
            number() (Infinity)
        ).equal(true);

        const nmr: number = (null as any);

        expect(
            number() (nmr)
        ).equal(false);

        expect(
            number() (null)
        ).equal(false);

        expect(
            number() ('qua')
        ).equal(false);

        expect(
            number() (true)
        ).equal(false);
    });
});
