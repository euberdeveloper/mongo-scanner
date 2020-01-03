import { MongoScanner } from '../../source/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import orderObject from '../utils/orderObject';

export default function() {

    describe('Test: setConnection function', function () {

        it(`Should set the connection to the default one`, async function () {

            const scanner = new MongoScanner('mongodb://localhost:23232');
            await scanner.setConnection();

            const expected = orderObject(require('./database-schema.test.json'));
            const result = orderObject(await scanner.getSchema());
            expect(result).to.deep.equal(expected);

        });

        it(`Should set the connection to mongodb://localhost:27017`, async function () {

            const scanner = new MongoScanner('mongodb://localhost:23232');
            await scanner.setConnection('mongodb://localhost:27017');

            const expected = orderObject(require('./database-schema.test.json'));
            const result = orderObject(await scanner.getSchema());
            expect(result).to.deep.equal(expected);

        });

        it(`Should set the connection even with persistent connection`, async function () {

            const scanner = new MongoScanner();
            await scanner.startConnection();
            await scanner.setConnection(null, { numberOfRetries: 10 });

            const expected = orderObject(require('./database-schema.test.json'));
            const result = orderObject(await scanner.getSchema());
            expect(result).to.deep.equal(expected);

        });

    });

}