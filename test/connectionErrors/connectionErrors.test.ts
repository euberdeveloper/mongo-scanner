import { MongoScanner, ConnectionError } from '../../source/index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

export default function () {

    describe('Test: connection errors', function () {

        it(`Should eventually throw a connection error`, async function () {

            const scanner = new MongoScanner('mongodb://mona:1234');

            const willFail = async function() {
                await scanner.startConnection();
            };

            return expect(willFail()).to.be.rejected;

        });
        
    });

}