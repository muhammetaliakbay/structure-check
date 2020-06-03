import { expect } from 'chai';
import {and, array, number, string} from './index';

describe('and-checker', () => {
    it('checks if data fits in all the specified types', () => {
        expect(
            and(array(string()), array(string())) (['qua', 'was', 'here'])
        ).equal(true);

        expect(
            and(array(string()), array(string())) (['qua', 'was', 'here'])
        ).equal(true);

        expect(
            and(string(), number()) ('qua')
        ).equal(false);

        expect(
            and(string(), number()) (1)
        ).equal(false);

    });
});
