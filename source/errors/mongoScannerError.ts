/**
 * An error occured with the mongo-scanner module.
 */
export class MongoScannerError extends Error {

    constructor(message?: string) {
        super(message);
    }

}