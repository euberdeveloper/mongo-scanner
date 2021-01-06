/* eslint-disable @typescript-eslint/naming-convention */

/**
 * An error occured with the mongo-scanner module.
 */
export class MongoScannerError extends Error {
    public __proto__: Error;

    constructor(message?: string) {
        // This includes a trick in order to make the instanceof properly work
        const trueProto = new.target.prototype;
        super(message);
        this.__proto__ = trueProto;

        this.name = 'MongoScannerError';
    }
}
