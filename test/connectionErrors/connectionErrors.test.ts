import { MongoScanner } from '@src/index';

import { expect } from 'chai';

export default function (): void {
    describe('Test: connection errors', function () {
        it(`Should eventually throw a connection error`, async function () {
            const scanner = new MongoScanner('mongodb://mona:1234');

            const willFail = async function () {
                await scanner.startConnection();
            };

            return expect(willFail()).to.be.rejected;
        });
    });
}
