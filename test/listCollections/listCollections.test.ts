import { MongoScanner } from '../../source/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import benchmark from '../utils/benchmark';

export default function() {

    describe('Test: listCollections function', function () {

        it(`Should list all collections of animals`, async function () {

            const scanner = new MongoScanner();
            const actualCollections = ['cats', 'cows', 'dogs', 'horses', 'lions', 'tigers', 'wombats'];
            const collections = await scanner.listCollections('animals');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of vegetables`, async function () {

            const scanner = new MongoScanner();
            const actualCollections = ['carrots', 'celery', 'fennel', 'lattuce'];
            const collections = await scanner.listCollections('vegetables');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of fruits`, async function () {

            const scanner = new MongoScanner();
            const actualCollections = ['apples', 'bananas', 'lemons', 'oranges'];
            const collections = await scanner.listCollections('fruits');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of database except for collection`, async function () {

            const options = {
                excludeCollections: 'collection'
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['collection_1', 'collection_2', 'collection_3'];
            const collections = await scanner.listCollections('database');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of database that do not finish with "_n"`, async function () {

            const options = {
                excludeCollections: /_[\d]/
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['collection'];
            const collections = await scanner.listCollections('database');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of test except for test`, async function () {

            const options = {
                excludeCollections: 'test'
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['test_1', 'test_2', 'test_3'];
            const collections = await scanner.listCollections('test');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of test that do not finish with "_n"`, async function () {

            const options = {
                excludeCollections: /_[\d]$/
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['test'];
            const collections = await scanner.listCollections('test');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of database_test except for collection and test`, async function () {

            const options = {
                excludeCollections: ['collection', 'test']
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['collection_1', 'collection_2', 'collection_3', 'test_1', 'test_2', 'test_3'];
            const collections = await scanner.listCollections('database_test');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of database_test that do not finish with "_n" and are not test`, async function () {

            const options = {
                excludeCollections: [/_[\d]$/, 'test']
            };

            const scanner = new MongoScanner(null, null, options);
            const actualCollections = ['collection'];
            const collections = await scanner.listCollections('database_test');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of admin`, async function () {

            const scanner = new MongoScanner();
            const actualCollections = ['system.version'];
            const collections = await scanner.listCollections('admin');

            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of admin except for the system ones`, async function () {

            const options = {
                excludeSystem: true
            };

            const scanner = new MongoScanner(null, null, options);
            const collections = await scanner.listCollections('admin');

            expect(collections).to.be.empty;

        });

        it(`Should list all collections of animals and check that using cache it is more efficient`, async function () {

            const scanner = new MongoScanner();
            
            const noCacheTime = await benchmark(23, async () => await scanner.listCollections('animals'));
            const cacheTime = await benchmark(23, async () => await scanner.listCollections('animals', { useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const actualCollections = ['cats', 'cows', 'dogs', 'horses', 'lions', 'tigers', 'wombats'];
            const collections = await scanner.listCollections('animals', { useCache: true });
            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of fruits except apples and bananas and check that using cache it is more efficient`, async function () {

            const options = {
                excludeCollections: ['apples', 'bananas']
            };
            const scanner = new MongoScanner(null, null, options);
            
            const noCacheTime = await benchmark(23, async () => await scanner.listCollections('fruits'));
            const cacheTime = await benchmark(23, async () => await scanner.listCollections('fruits', { useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const actualCollections = ['lemons', 'oranges'];
            const collections = await scanner.listCollections('fruits', { useCache: true });
            const result = actualCollections.sort().join();
            const expected = collections.sort().join();
            expect(result).to.equal(expected);
        });

    });

}