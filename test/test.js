'use strict';
const { MongoScanner } = require('../dist/index');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;

describe('MongoBack module tests', function() {

    require('./listDatabases/listDatabases.test')(expect, MongoScanner);
    require('./listCollections/listCollections.test')(expect, MongoScanner);
    require('./getSchema/getSchema.test')(expect, MongoScanner);
    require('./persistentConnection/persistentConnection.test')(expect, MongoScanner);

});