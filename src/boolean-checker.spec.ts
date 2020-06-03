import { expect } from 'chai';
import {boolean} from './index';

describe('boolean-checker', () => {
    it('checks if data is boolean or not', () => {
        expect(
            boolean() (false)
        ).equal(true);

        const bln: boolean = (null as any);

        expect(
            boolean() (bln)
        ).equal(false);

        expect(
            boolean() (null)
        ).equal(false);

        expect(
            boolean() ('qua')
        ).equal(false);

        expect(
            boolean() (-1)
        ).equal(false);
    });
});
