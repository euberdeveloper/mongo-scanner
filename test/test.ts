import listDatabases from './listDatabases/listDatabases.test';
import listCollections from './listCollections/listCollections.test';
import getSchema from './getSchema/getSchema.test';
import persistentConnection from './persistentConnection/persistentConnection.test';
import clearCache from './clearCache/clearCache.test';
import connectionErrors from './connectionErrors/connectionErrors.test';

describe('MongoBack module tests', function () {
    this.timeout(0);

    listDatabases();
    listCollections();
    getSchema();
    persistentConnection();
    clearCache();
    connectionErrors();
});
