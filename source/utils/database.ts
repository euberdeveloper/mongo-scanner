import { MongoClient, MongoClientOptions } from 'mongodb';
import { ConnectionError, DisconnectionError } from '../errors';

export class Database {

    private uri: string;
    private connection: MongoClient = null;
    private options: MongoClientOptions = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    };

    get connected(): boolean {
        return this.connection !== null;
    }

    public constructor(uri: string, options: MongoClientOptions) {
        this.uri = uri;
        this.options = { ...options, ...this.options };
    }

    public async connect(): Promise<void> {
        this.connection = await MongoClient.connect(this.uri, this.options);
    }

    public async listDatabases(): Promise<string[]> {
        return (await this.connection.db().admin().listDatabases())
            .databases.map(database => database.name);
    }

    public async listCollections(db: string): Promise<string[]> {
        return (await this.connection.db(db).listCollections().toArray())
            .map(collection => collection.name);
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this.connection.close();
            this.connection = null;
        }
    }

    public static async connectDatabase(database: Database): Promise<void> {
        try {
            await database.connect();
        }
        catch (error) {
            throw new ConnectionError(null, database.uri, database.options, error);
        }
    }

    public static async disconnectDatabase(database: Database): Promise<void> {
        try {
            await database.disconnect();
        }
        catch (error) {
            throw new DisconnectionError(null, database.uri, database.options, error);
        }
    }

}