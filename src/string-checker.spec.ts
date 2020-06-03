import { expect } from 'chai';
import {string} from './index';

describe('string-checker', () => {
    it('checks if data is string or not', () => {
        expect(
            string() ('qua')
        ).equal(true);

        const str: string = (null as any);

        expect(
            string() (str)
        ).equal(false);

        expect(
            string() (null)
        ).equal(false);

        expect(
            string() (0)
        ).equal(false);

        expect(
            string() (true)
        ).equal(false);
    });
});
