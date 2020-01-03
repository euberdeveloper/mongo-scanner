import listDatabases from './listDatabases/listDatabases.test';
import listCollections from './listCollections/listCollections.test';
import getSchema from './getSchema/getSchema.test';
import persistentConnection from './persistentConnection/persistentConnection.test';
import clearCache from './clearCache/clearCache.test';
import setConnection from './setConnection/setConnection.test';

describe('MongoBack module tests', function() {

    listDatabases();
    listCollections();
    getSchema();
    persistentConnection();
    clearCache();
    setConnection();

});