import { MongoScannerError } from './mongoScannerError';

/**
 * An error occurred with the module mongo-scanner when disconnecting to mongodb.
 */
export class MongoScannerDisconnectionError extends MongoScannerError {
    private static readonly DEFAULT_MESSAGE = 'Error in disconnecting to MongoDB';
    /**
     * The uri of the failed disconnection.
     */
    public uri: string;
    /**
     * The MongoClient options of the failed disconnection.
     */
    public options: any;
    /**
     * The error that happened when disconnecting to mongodb.
     */
    public triggerError: Error;

    constructor(message?: string, uri?: string, options?: any, triggerError?: Error) {
        super(message ?? MongoScannerDisconnectionError.DEFAULT_MESSAGE);
        this.name = 'MongoScannerDisconnectionError';
        this.uri = uri ?? null;
        this.options = options ?? null;
        this.triggerError = triggerError ?? null;
    }
}
