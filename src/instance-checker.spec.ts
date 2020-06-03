import { expect } from 'chai';
import {instance} from './index';

describe('instance-checker', () => {
    it('checks if data is an instance of specified type', () => {
        expect(
            instance(Uint8Array) (new Uint8Array(1))
        ).equal(true);

        expect(
            instance(Array) (new Uint8Array(1))
        ).equal(false);

        expect(
            instance(ArrayBuffer) (new ArrayBuffer(1))
        ).equal(true);

        expect(
            instance(Object) (new Error())
        ).equal(true);
    });
});
