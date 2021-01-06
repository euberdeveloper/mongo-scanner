import {
    MongoScannerError,
    ConnectionError,
    DisconnectionError,
    ListCollectionsError,
    ListDatabasesError
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

        it(`Should properly create a default ConnectionError`, function () {
            const error = new ConnectionError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ConnectionError);
            expect(error.name).to.equals('MongoScannerConnectionError');
        });
        it(`Should properly create a custom ConnectionError`, function () {
            const triggerError = new Error();
            const options = {};
            const error = new ConnectionError('MESSAGE', 'uri', options, triggerError);

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ConnectionError);
            expect(error.name).to.equals('MongoScannerConnectionError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.uri).to.equals('uri');
            expect(error.options).to.equals(options);
            expect(error.triggerError).to.equals(triggerError);
        });

        it(`Should properly create a default DisconnectionError`, function () {
            const error = new DisconnectionError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(DisconnectionError);
            expect(error.name).to.equals('MongoScannerDisconnectionError');
        });
        it(`Should properly create a custom DisconnectionError`, function () {
            const triggerError = new Error();
            const options = {};
            const error = new DisconnectionError('MESSAGE', 'uri', options, triggerError);

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(DisconnectionError);
            expect(error.name).to.equals('MongoScannerDisconnectionError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.uri).to.equals('uri');
            expect(error.options).to.equals(options);
            expect(error.triggerError).to.equals(triggerError);
        });

        it(`Should properly create a default ListCollectionsError`, function () {
            const error = new ListCollectionsError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ListCollectionsError);
            expect(error.name).to.equals('MongoScannerListCollectionsError');
        });
        it(`Should properly create a custom ListCollectionsError`, function () {
            const error = new ListCollectionsError('MESSAGE', 'db');

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ListCollectionsError);
            expect(error.name).to.equals('MongoScannerListCollectionsError');
            expect(error.message).to.equals('MESSAGE');
            expect(error.db).to.equals('db');
        });

        it(`Should properly create a default ListDatabasesError`, function () {
            const error = new ListDatabasesError();

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ListDatabasesError);
            expect(error.name).to.equals('MongoScannerListDatabasesError');
        });
        it(`Should properly create a custom ListDatabasesError`, function () {
            const error = new ListDatabasesError('MESSAGE');

            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(ListDatabasesError);
            expect(error.name).to.equals('MongoScannerListDatabasesError');
            expect(error.message).to.equals('MESSAGE');
        });
    });
}
