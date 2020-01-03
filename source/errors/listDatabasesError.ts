import { MongoScannerError } from './mongoScannerError';

/**
 * An error occurred with the module mongo-scanner when listing databases of mongodb.
 */
export class ListDatabasesError extends MongoScannerError {

    private static readonly DEFAULT_MESSAGE = 'Error in listing databases';
    /**
     * The error that happened when listing the mongodb databases.
     */
    public triggerError: Error;

    constructor(message?: string, triggerError?: Error) {
        /* istanbul ignore next */
        super(message || ListDatabasesError.DEFAULT_MESSAGE);
        this.name = 'MongoScannerListDatabasesError';
        this.triggerError = triggerError || null;
    }

}