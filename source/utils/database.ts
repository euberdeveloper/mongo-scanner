import { MongoClient, MongoClientOptions } from 'mongodb';
import { MongoScannerConnectionError, MongoScannerDisconnectionError } from '@/errors';

export class Database {
    private readonly uri: string;
    private connection: MongoClient = null;
    private readonly options: MongoClientOptions = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    };

    get connected(): boolean {
        return this.connection !== null;
    }

    constructor(uri: string, options: MongoClientOptions) {
        this.uri = uri;
        this.options = { ...options, ...this.options };
    }

    public static async connectDatabase(database: Database): Promise<void> {
        try {
            await database.connect();
        } catch (error) {
            throw new MongoScannerConnectionError(null, database.uri, database.options, error);
        }
    }

    public static async disconnectDatabase(database: Database): Promise<void> {
        try {
            await database.disconnect();
        } catch (error) {
            throw new MongoScannerDisconnectionError(null, database.uri, database.options, error);
        }
    }

    public async connect(): Promise<void> {
        if (!this.connected) {
            this.connection = await MongoClient.connect(this.uri, this.options);
        }
    }

    public async listDatabases(): Promise<string[]> {
        return (await this.connection.db().admin().listDatabases()).databases.map(database => database.name);
    }

    public async listCollections(db: string): Promise<string[]> {
        return (await this.connection.db(db).listCollections().toArray()).map(collection => collection.name);
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this.connection.close();
            this.connection = null;
        }
    }
}
