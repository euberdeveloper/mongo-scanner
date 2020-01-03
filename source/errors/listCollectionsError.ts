import { MongoScannerError } from './mongoScannerError';

/**
 * An error occurred with the module mongo-scanner when listing collections of mongodb.
 */
export class ListCollectionsError extends MongoScannerError {

    private static readonly DEFAULT_MESSAGE = 'Error in listing collections';
    /**
     * The database whose collections were tried to be retrieved.
     */
    public db: string;
    /**
     * The error that happened when listing the mongodb collections.
     */
    public triggerError: Error;

    constructor(message?: string, db?: string, triggerError?: Error) {
        /* istanbul ignore next */
        super(message || ListCollectionsError.DEFAULT_MESSAGE);
        this.name = 'MongoScannerListCollectionsError';
        this.db = db;
        this.triggerError = triggerError || null;
    }

}