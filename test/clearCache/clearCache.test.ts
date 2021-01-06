import { MongoScanner } from '../../source/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import benchmark from '../utils/benchmark';
import orderObject from '../utils/orderObject';

export default function (): void {
    describe('Test: clearCache function', function () {
        it(`Should clear the cache and check it worked`, async function () {
            const scanner = new MongoScanner();

            const withoutClearedCache = async function () {
                await scanner.getSchema();
                await scanner.getSchema({ useCache: true });
            };
            const withClearedCache = async function () {
                await scanner.getSchema();
                scanner.clearCache();
                await scanner.getSchema({ useCache: true });
            };

            const withoutClearedCacheTime = await benchmark(23, withoutClearedCache);
            const withClearedCacheTime = await benchmark(23, withClearedCache);
            expect(withoutClearedCacheTime < withClearedCacheTime).to.true;

            scanner.clearCache();
            const expected = orderObject(require('./database-schema.test.json'));
            const result = orderObject(await scanner.getSchema({ useCache: true }));
            expect(result).to.deep.equal(expected);
        });
    });
}
