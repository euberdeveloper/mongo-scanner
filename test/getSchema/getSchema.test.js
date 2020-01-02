module.exports = (expect, MongoScanner) => {

    describe('Test: getSchema function', function () {

        function orderObject(object) {
            Object.keys(object).map(key => {
                if (Array.isArray(object[key])) {
                    object[key] = object[key].sort();
                }
                else if (typeof object[key] === 'object') {
                    orderObject(object[key]);
                }
            });
        }

        async function benchmark(n, callback) {
            let total = 0;

            for (let i = 0; i < n; i++) {
                const start = Date.now();
                await callback();
                const end = Date.now();
                total += (end - start);
            }

            return (total / n);
        }

        it(`Should get the database schema`, async function () {

            const scanner = new MongoScanner();
            const expected = orderObject(require('./expected/first.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get the database schema without system collections`, async function () {

            const options = {
                excludeSystem: true
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/second.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get the database schema without the admin database`, async function () {

            const options = {
                excludeDatabases: 'admin'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/third.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get the database schema without the empty database and system collections`, async function () {

            const options = {
                excludeSystem: true,
                excludeDatabases: 'admin'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/fourth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except the databases containing "database" or "test"`, async function () {

            const options = {
                excludeDatabases: [/database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/fifth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except database vegetables and the ones containing "database" or "test"`, async function () {

            const options = {
                excludeDatabases: ['vegetables', /database/, /test/]
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/sixth.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except database vegetables and apples and wombats collections`, async function () {

            const options = {
                excludeDatabases: 'vegetables',
                excludeCollections: ['apples', 'wombats']
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/seventh.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except test database and collections containing "database" and system collections`, async function () {

            const options = {
                excludeSystem: true,
                excludeDatabases: 'test',
                excludeCollections: /database/
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/eight.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

        it(`Should get the database schema and check that with useCache is more efficient`, async function () {

            const scanner = new MongoScanner();

            const noCacheTime = await benchmark(23, async () => await scanner.getSchema());
            const cacheTime = await benchmark(23, async () => await scanner.getSchema({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const expected = orderObject(require('./expected/ninth.test.json'));
            const result = orderObject(await scanner.getSchema({ useCache: true }));
            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except fruit database and cats collection and check that with useCache is more efficient`, async function () {

            const options = {
                excludeDatabases: 'fruit',
                excludeCollections: 'cats'
            };

            const scanner = new MongoScanner(null, null, options);

            const noCacheTime = await benchmark(23, async () => await scanner.getSchema());
            const cacheTime = await benchmark(23, async () => await scanner.getSchema({ useCache: true }));
            expect(cacheTime < noCacheTime).to.true;

            const expected = orderObject(require('./expected/tenth.test.json'));
            const result = orderObject(await scanner.getSchema({ useCache: true }));
            expect(result).to.deep.equal(expected)

        });

        it(`Should get database schema except for the system collections and the collection empty and the empties databases`, async function () {

            const options = {
                excludeSystem: true,
                excludeEmptyDatabases: true,
                excludeCollections: 'empty'
            };

            const scanner = new MongoScanner(null, null, options);
            const expected = orderObject(require('./expected/eleventh.test.json'));
            const result = orderObject(await scanner.getSchema());

            expect(result).to.deep.equal(expected)

        });

    });

}