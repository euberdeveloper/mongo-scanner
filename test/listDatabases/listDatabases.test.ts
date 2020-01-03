import { MongoScanner } from '../../source/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import benchmark from '../utils/benchmark';

export default function() {

    describe('Test: listDatabases function', function () {

        it(`Should list all databases`, async function () {

            const scanner = new MongoScanner();
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database', 'database_test', 'test', 'empty'];
            const databases = await scanner.listDatabases();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all databases that does not end with "s"`, async function () {

            const options = {
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

            const options = {
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

            const options = {
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

            const options = {
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

            const options = {
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

            const options = {
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

            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database', 'database_test', 'test', 'empty'];
            const databases = await scanner.listDatabases({ useCache: true });
            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all databases except vegetables and the ones containing "database" or "test" and check that using cache it is more efficient`, async function () {

            const options = {
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

    });

}