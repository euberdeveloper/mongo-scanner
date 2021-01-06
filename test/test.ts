import * as moduleAlias from 'module-alias';
import * as path from 'path';
moduleAlias.addAlias('@', path.join(process.cwd(), 'dist', 'source'));
moduleAlias.addAlias('@src', path.join(process.cwd(), 'dist', 'source'));
moduleAlias.addAlias('@test', path.join(process.cwd(), 'dist', 'test'));

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import errors from '@test/errors/errors.test';
import listDatabases from '@test/listDatabases/listDatabases.test';
import listCollections from '@test/listCollections/listCollections.test';
import getSchema from '@test/getSchema/getSchema.test';
import persistentConnection from '@test/persistentConnection/persistentConnection.test';
import clearCache from '@test/clearCache/clearCache.test';
import connectionErrors from '@test/connectionErrors/connectionErrors.test';

describe('MongoBack module tests', function () {
    this.timeout(0);

    listDatabases();
    listCollections();
    getSchema();
    persistentConnection();
    clearCache();
    connectionErrors();
    errors();
});
