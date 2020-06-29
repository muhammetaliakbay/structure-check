import { expect } from 'chai';
import {array, constant, number, object, optional, or, string, tuple} from './index';

describe('object-checker', () => {
    it('checks if data fits in the structure of desired object', () => {
        const checker = object({
            hello: optional(string()),
            world: or(number(), tuple(number(), number()), array(constant('earth' as const)))
        });

        expect(
            checker ({
                world: [14, 17]
            })
        ).equal(true);

        expect(
            checker ({
                hello: 'merhaba',
                world: ['earth']
            })
        ).equal(true);

        expect(
            checker ({
                hello: 'hi',
                world: ['mars']
            })
        ).equal(false);

        expect(
            checker ('qua')
        ).equal(false);

        expect(
            checker ([])
        ).equal(false);
    });
});
