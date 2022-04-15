/* eslint-disable @typescript-eslint/naming-convention */

/**
 * An error occured with the mongo-scanner module.
 */
export class MongoScannerError extends Error {
    constructor(message?: string) {
        // This includes a trick in order to make the instanceof properly work
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'MongoScannerError';
    }
}
