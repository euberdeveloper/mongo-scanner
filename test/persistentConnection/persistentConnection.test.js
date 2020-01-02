module.exports = (expect, MongoScanner) => {

    describe('Test: startConnection and endConnection functions', function () {

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

        it(`Should list all databases and check that with persistent connection is faster`, async function () {

            const scanner = new MongoScanner();

            const noPersistentTime = await benchmark(23, async () => await scanner.listDatabases());
            await scanner.startConnection();
            const persistentTime = await benchmark(23, async () => await scanner.listDatabases());
            await scanner.endConnection();
            expect(persistentTime < noPersistentTime).to.true;

            await scanner.startConnection();
            const actualDatabases = ['admin', 'animals', 'fruits', 'vegetables', 'database', 'database_test', 'test', 'empty'];
            const databases = await scanner.listDatabases();
            await scanner.endConnection();

            const result = databases.sort().join();
            const expected = actualDatabases.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should list all collections of animals and check that with persistent connection is faster`, async function () {

            const scanner = new MongoScanner();
        
            const noPersistentTime = await benchmark(23, async () => await scanner.listCollections('animals'));
            await scanner.startConnection();
            const persistentTime = await benchmark(23, async () => await scanner.listCollections('animals'));
            await scanner.endConnection();
            expect(persistentTime < noPersistentTime).to.true;

            await scanner.startConnection();
            const actualCollections = ['cats', 'cows', 'dogs', 'horses', 'lions', 'tigers', 'wombats'];
            const collections = await scanner.listCollections('animals');
            await scanner.endConnection();
            
            const result = collections.sort().join();
            const expected = actualCollections.sort().join();
            expect(result).to.equal(expected);

        });

        it(`Should get database schema and check that with persistent connection is faster`, async function () {

            const scanner = new MongoScanner();
            

            const noPersistentTime = await benchmark(23, async () => await scanner.getSchema());
            await scanner.startConnection();
            const persistentTime = await benchmark(23, async () => await scanner.getSchema());
            await scanner.endConnection();
            expect(persistentTime < noPersistentTime).to.true;

            await scanner.startConnection();
            const expected = orderObject(require('./database-schema.test.json'));
            const result = orderObject(await scanner.getSchema());
            await scanner.endConnection();
            
            expect(result).to.deep.equal(expected);

        });

    });

}