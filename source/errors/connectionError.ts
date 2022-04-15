import { MongoScannerError } from './mongoScannerError';

/**
 * An error occurred with the module mongo-scanner when connecting to mongodb.
 */
export class MongoScannerConnectionError extends MongoScannerError {
    private static readonly DEFAULT_MESSAGE = 'Error in connecting to MongoDB';
    /**
     * The uri of the failed connection.
     */
    public uri: string;
    /**
     * The MongoClient options of the failed connection.
     */
    public options: any;
    /**
     * The error that happened when connecting to mongodb.
     */
    public triggerError: Error;

    constructor(message?: string, uri?: string, options?: any, triggerError?: Error) {
        /* istanbul ignore next */
        super(message ?? MongoScannerConnectionError.DEFAULT_MESSAGE);
        this.name = 'MongoScannerConnectionError';
        this.uri = uri ?? null;
        this.options = options ?? null;
        this.triggerError = triggerError ?? null;
    }
}
