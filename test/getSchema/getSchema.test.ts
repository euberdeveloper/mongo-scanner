import { MongoScanner, ScanOptions } from '@src/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import benchmark from '@test/utils/benchmark';
import orderObject from '@test/utils/orderObject';

export default function (): void {
    describe('Test: getSchema function', function () {
        it(`Should get the database schema`, async function () {
            const scanner = new MongoScanner();
            const expected = orderObject(require('./expected/first.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get the database schema without system collections`, async function () {
            const options: ScanOptions = {
                excludeSystem: true
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/second.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get the database schema without the admin database`, async function () {
            const options: ScanOptions = {
                excludeDatabases: 'admin'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/third.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get the database schema without the empty database and system collections`, async function () {
            const options: ScanOptions = {
                excludeSystem: true,
                excludeDatabases: 'empty'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/fourth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except the databases containing "database" or "test"`, async function () {
            const options: ScanOptions = {
                excludeDatabases: [/database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/fifth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except database vegetables and the ones containing "database" or "test"`, async function () {
            const options: ScanOptions = {
                excludeDatabases: ['vegetables', /database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/sixth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except database vegetables and apples and wombats collections`, async function () {
            const options: ScanOptions = {
                excludeDatabases: 'vegetables',
                excludeCollections: ['apples', 'wombats']
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/seventh.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except test database and collections containing "collection" and system collections`, async function () {
            const options: ScanOptions = {
                excludeSystem: true,
                excludeDatabases: 'test',
                excludeCollections: /collection/
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/eight.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get the database schema and check that with useCache is more efficient`, async function () {
            const scanner = new MongoScanner();

            const noCacheTime = await benchmark(23, async () => await scanner.getSchema());
            const cacheTime = await benchmark(23, async () => await scanner.getSchema({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const expected = orderObject(require('./expected/ninth.test.json'));
            const result = orderObject(await scanner.getSchema({ useCache: true }));
            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except fruits database and cats collection and check that with useCache is more efficient`, async function () {
            const options: ScanOptions = {
                excludeDatabases: 'fruits',
                excludeCollections: 'cats'
            };

            const scanner = new MongoScanner(null, null, options);

            const noCacheTime = await benchmark(23, async () => await scanner.getSchema());
            const cacheTime = await benchmark(23, async () => await scanner.getSchema({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const expected = orderObject(require('./expected/tenth.test.json'));
            const result = orderObject(await scanner.getSchema({ useCache: true }));
            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema except for the system collections and the collection empty and the empties databases`, async function () {
            const options: ScanOptions = {
                excludeSystem: true,
                excludeEmptyDatabases: true,
                excludeCollections: 'empty'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/eleventh.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema multiple times and concurrently`, async function () {
            const n = 100;
            const range = [...Array(n).keys()];

            const scanner = new MongoScanner();
            const actualSchema = orderObject(require('./expected/first.test.json'));

            const promises = range.map(async () => orderObject(await scanner.getSchema()));
            const result = await Promise.all(promises);

            const expected = range.map(() => actualSchema);
            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema multiple times and concurrently with persistent connection`, async function () {
            const n = 100;
            const range = [...Array(n).keys()];

            const scanner = new MongoScanner();
            const actualSchema = orderObject(require('./expected/first.test.json'));

            await scanner.startConnection();
            const promises = range.map(async () => orderObject(await scanner.getSchema()));
            const result = await Promise.all(promises);
            await scanner.endConnection();

            const expected = range.map(() => actualSchema);
            expect(result).to.deep.equal(expected);
        });

        it(`Should get database schema multiple times and concurrently and stop the persistent in the middle`, async function () {
            const n = 100;
            const range = [...Array(n).keys()];

            const scanner = new MongoScanner();
            const actualSchema = orderObject(require('./expected/first.test.json'));

            await scanner.startConnection();
            const stopAndMock = async function () {
                await scanner.endConnection();
                return actualSchema;
            };
            const promises = range.map(async () => orderObject(await scanner.getSchema()));
            promises[Math.floor(n / 4)] = stopAndMock();
            const result = await Promise.all(promises);

            const expected = range.map(() => actualSchema);
            expect(result).to.deep.equal(expected);
        });
    });
}
