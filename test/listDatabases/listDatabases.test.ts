import { MongoScanner, ScanOptions } from '@src/index';

import { expect } from 'chai';

import benchmark from '@test/utils/benchmark';

export default function (): void {
    describe('Test: listDatabases function', function () {
        it(`Should list all databases`, async function () {
            const scanner = new MongoScanner();
            const actualDatabases = [
                'admin',
                'animals',
                'fruits',
                'vegetables',
                'database',
                'database_test',
                'test',
                'empty'
            ];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases that does not end with "s"`, async function () {
            const options: ScanOptions = {
                excludeDatabases: /s$/
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'database', 'database_test', 'test', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except database`, async function () {
            const options: ScanOptions = {
                excludeDatabases: 'database'
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database_test', 'test', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except test`, async function () {
            const options: ScanOptions = {
                excludeDatabases: 'test'
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database', 'database_test', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except database and test`, async function () {
            const options: ScanOptions = {
                excludeDatabases: ['database', 'test']
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database_test', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except the ones containing "database" or "test"`, async function () {
            const options: ScanOptions = {
                excludeDatabases: [/database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except vegetables and the ones containing "database" or "test"`, async function () {
            const options: ScanOptions = {
                excludeDatabases: ['vegetables', /database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const actualDatabases = ['admin', 'animals', 'fruits', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases and check that using cache it is more efficient`, async function () {
            const scanner = new MongoScanner();

            const noCacheTime = await benchmark(23, async () => await scanner.listDatabases());
            const cacheTime = await benchmark(23, async () => await scanner.listDatabases({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const actualDatabases = [
                'admin',
                'animals',
                'fruits',
                'vegetables',
                'database',
                'database_test',
                'test',
                'empty'
            ];
            const databases = await scanner.listDatabases({ useCache: true });
            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases except vegetables and the ones containing "database" or "test" and check that using cache it is more efficient`, async function () {
            const options: ScanOptions = {
                excludeDatabases: ['vegetables', /database/, /test/]
            };
            const scanner = new MongoScanner(null, null, options);

            const noCacheTime = await benchmark(23, async () => await scanner.listDatabases());
            const cacheTime = await benchmark(23, async () => await scanner.listDatabases({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const actualDatabases = ['admin', 'animals', 'fruits', 'empty'];
            const databases = await scanner.listDatabases({ useCache: true });
            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);
        });

        it(`Should list all databases multiple times and concurrently`, async function () {
            const n = 100;
            const range = [...new Array(n).keys()];

            const scanner = new MongoScanner();
            const actualDatabases = [
                'admin',
                'animals',
                'fruits',
                'vegetables',
                'database',
                'database_test',
                'test',
                'empty'
            ];

            const promises = range.map(async () => (await scanner.listDatabases()).sort());
            const result = await Promise.all(promises);

            const expected = range.map(() => actualDatabases.sort());
            expect(result).to.deep.equal(expected);
        });

        it(`Should list all databases multiple times and concurrently with persistent connection`, async function () {
            const n = 100;
            const range = [...new Array(n).keys()];

            const scanner = new MongoScanner();
            const actualDatabases = [
                'admin',
                'animals',
                'fruits',
                'vegetables',
                'database',
                'database_test',
                'test',
                'empty'
            ];

            await scanner.startConnection();
            const promises = range.map(async () => (await scanner.listDatabases()).sort());
            const result = await Promise.all(promises);
            await scanner.endConnection();

            const expected = range.map(() => actualDatabases.sort());
            expect(result).to.deep.equal(expected);
        });

        it(`Should list all databases multiple times and concurrently and stop the persistent in the middle`, async function () {
            const n = 100;
            const range = [...new Array(n).keys()];

            const scanner = new MongoScanner();
            const actualDatabases = [
                'admin',
                'animals',
                'fruits',
                'vegetables',
                'database',
                'database_test',
                'test',
                'empty'
            ];

            await scanner.startConnection();
            const stopAndMock = async function () {
                await scanner.endConnection();
                return actualDatabases.sort();
            };
            const promises = range.map(async () => (await scanner.listDatabases()).sort());
            promises[Math.floor(n / 4)] = stopAndMock();
            const result = await Promise.all(promises);

            const expected = range.map(() => actualDatabases.sort());
            expect(result).to.deep.equal(expected);
        });
    });
}
