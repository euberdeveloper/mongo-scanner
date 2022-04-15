import {
    MongoScannerError,
    MongoScannerConnectionError,
    MongoScannerDisconnectionError,
    MongoScannerListCollectionsError,
    MongoScannerListDatabasesError
} from '@src/errors';

import { expect } from 'chai';

export default function (): void {
    describe('Test: errors classes', function () {
        it(`Should properly create a default MongoScannerError`, function () {
            const error = new MongoScannerError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerError);
            expect(error.name).to.equals('MongoScannerError');
        });
        it(`Should properly create a custom MongoScannerError`, function () {
            const error = new MongoScannerError('MESSAGE');

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerError);
            expect(error.name).to.equals('MongoScannerError');
            expect(error.message).to.equals('MESSAGE');
        });

        it(`Should properly create a default MongoScannerConnectionError`, function () {
            const error = new MongoScannerConnectionError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerConnectionError);
            expect(error.name).to.equals('MongoScannerConnectionError');
        });
        it(`Should properly create a custom MongoScannerConnectionError`, function () {
            const triggerError = new Error();
            const options = {};
            const error = new MongoScannerConnectionError('MESSAGE', 'uri', options, triggerError);

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerConnectionError);
            expect(error.name).to.equals('MongoScannerConnectionError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.uri).to.equals('uri');
            expect(error.options).to.equals(options);
            expect(error.triggerError).to.equals(triggerError);
        });

        it(`Should properly create a default MongoScannerDisconnectionError`, function () {
            const error = new MongoScannerDisconnectionError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerDisconnectionError);
            expect(error.name).to.equals('MongoScannerDisconnectionError');
        });
        it(`Should properly create a custom MongoScannerDisconnectionError`, function () {
            const triggerError = new Error();
            const options = {};
            const error = new MongoScannerDisconnectionError('MESSAGE', 'uri', options, triggerError);

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerDisconnectionError);
            expect(error.name).to.equals('MongoScannerDisconnectionError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.uri).to.equals('uri');
            expect(error.options).to.equals(options);
            expect(error.triggerError).to.equals(triggerError);
        });

        it(`Should properly create a default MongoScannerListCollectionsError`, function () {
            const error = new MongoScannerListCollectionsError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerListCollectionsError);
            expect(error.name).to.equals('MongoScannerListCollectionsError');
        });
        it(`Should properly create a custom MongoScannerListCollectionsError`, function () {
            const error = new MongoScannerListCollectionsError('MESSAGE', 'db');

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerListCollectionsError);
            expect(error.name).to.equals('MongoScannerListCollectionsError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.db).to.equals('db');
        });

        it(`Should properly create a default MongoScannerListDatabasesError`, function () {
            const error = new MongoScannerListDatabasesError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerListDatabasesError);
            expect(error.name).to.equals('MongoScannerListDatabasesError');
        });
        it(`Should properly create a custom MongoScannerListDatabasesError`, function () {
            const error = new MongoScannerListDatabasesError('MESSAGE');

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(MongoScannerListDatabasesError);
            expect(error.name).to.equals('MongoScannerListDatabasesError');
            expect(error.message).to.equals('MESSAGE');
        });
    });
}
