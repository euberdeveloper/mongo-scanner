import { Database } from './utils/database';
import { Cache } from './utils/cache';

/**
 * Represents the database's schema. Every key is a database and every value its collections.
 */
export interface DatabaseSchema {
    [database: string]: string[];
}

/**
 * The options used when [[MongoScanner]] looks for data.
 */
export interface ScanOptions {
    /**
     * If you want to use the cache before starting a database connection. When true, all the 
     * previous executions of the [[MongoScanner]] instance will be checked before establishing a 
     * new database connection. The cache is update every time an execution retrieves data 
     * form the database connection.
     * 
     * Default: false
     */
    useCache?: boolean;
    /**
     * Databases that you want to exclude from the result. You can provide a string, a Regexp or 
     * an array of both. A database will be removed from the result if it is equal to a string 
     * or matches a Regexp.
     * 
     * Default: undefined
     */
    excludeDatabases?: string | RegExp | (string | RegExp)[];
    /**
     * Collections that you want to exclude from the result. You can provide a string, a Regexp or 
     * an array of both. A collection will be removed from the result if it is equal to a string 
     * or matches a Regexp.
     * 
     * Default: undefined
     */
    excludeCollections?: string | RegExp | (string | RegExp)[];
    /**
     * If you want system collections to be excluded by the result.
     * 
     * Default: false
     */
    excludeSystem?: boolean;
};

const DEFAULT_OPTIONS: ScanOptions = {
    useCache: false,
    excludeDatabases: undefined,
    excludeCollections: undefined,
    excludeSystem: false
};

/**
 * The MongoScanner class, to retrieve the database schema or to list databases and collections of 
 * a MongoDB database.
 */
export class MongoScanner {

    private database: Database;
    private cache: Cache;
    private options: ScanOptions;
    private persistentConnected: boolean;

    /**
     * The constructor of the [[MongoScanner]] class. The params are the uri and options for the 
     * database connections. The connection is not established by the constructor, the connection 
     * parameters are only saved in the [[MongoScanner]] instance.
     * @param uri The string uri of the mongodb connection. Default: 'mongodb://localhost:27017'.
     * @param connectionOptions The options object of the mongodb connection. The npm mongodb module is used under
     * the hood and this is the object provided to MongoClient. Default: { }.
     * @param options The options that will be used as a fallback for the [[ScanOptions]]. For all the 
     * keys that will not be present in the options provided to a method that retrieves database or collections,
     * the values provided here will be used instead of the default ones. Default: { }.
     */
    constructor(uri = 'mongodb://localhost:27017', connectionOptions: any = {}, options: ScanOptions = {}) {
        this.database = new Database(uri, connectionOptions);
        this.cache = new Cache();
        this.options = this.mergeOptionsWithDefault(options);
        this.persistentConnected = false;
    }

    private mergeOptionsWithDefault(options: ScanOptions = {}): ScanOptions {
        const merged: ScanOptions = {};

        for (const key in DEFAULT_OPTIONS) {
            merged[key] = (options[key] === undefined ? DEFAULT_OPTIONS[key] : options[key]);
        }

        return merged;
    }

    private mergeOptions(options: ScanOptions = {}): ScanOptions {
        const merged: ScanOptions = {};

        for (const key in this.options) {
            merged[key] = (options[key] === undefined ? this.options[key] : options[key]);
        }

        return merged;
    }

    private passes(item: string, excludes: (string | RegExp)[]): boolean {
        return excludes.every(exclude => typeof exclude === 'string'
            ? item !== exclude
            : !exclude.test(item));
    }

    private filterDatabases(databases: string[], options: ScanOptions): string[] {
        let result = databases;

        if (options.excludeDatabases) {
            const excludes = Array.isArray(options.excludeDatabases) ? options.excludeDatabases : [options.excludeDatabases];
            result = result
                .filter(database => this.passes(database, excludes));
        }
        
        return result;
    }

    private filterCollections(collections: string[], options: ScanOptions): string[] {
        let result = collections;

        if (options.excludeSystem) {
            result = result
                .filter(collection => /^system./.test(collection));
        }
        if (options.excludeCollections) {
            const excludes = Array.isArray(options.excludeCollections) ? options.excludeCollections : [options.excludeCollections];
            result = result
                .filter(database => this.passes(database, excludes));
        }
        
        return result;
    }

    /**
     * Sets the mongodb connection parameters. It does not establishes the connection but only 
     * saves the parameters in the [[MongoScanner]] instance. If a connection was already established
     * it will be closed.
     * @param uri The string uri of the mongodb connection. Default: 'mongodb://localhost:27017'.
     * @param options The options object of the mongodb connection. The npm mongodb module is used under
     * the hood and this is the object provided to MongoClient. Default: { }.
     */
    public async setConnection(uri = 'mongodb://localhost:27017', options: any = {}): Promise<void> {
        await this.database.disconnect();
        this.persistentConnected = false;
        this.database = new Database(uri, options);
    }

    /**
     * Starts a persistent connection to mongodb. By default, all methods that retrieve databases or
     * collections from the mongodb open a connection before beginning and close it after finishing.
     * This method allows you to have a persistent connection instead and is useful if you need to perform 
     * more than an operation and do not want to open and close connections for each of them.
     */
    public async startConnection(): Promise<void> {
        await this.database.connect();
        this.persistentConnected = true;
    }

    /**
     * Closes an already open persistent connection.
     */
    public async endConnection(): Promise<void> {
        await this.database.disconnect();
        this.persistentConnected = false;
    }

    /**
     * Retrieves the databases of a mongodb as a promise to an array of strings.
     * @param opt The [[ScanOptions]] options.
     * @returns A promise to an array of strings containing the retrieved databases.
     */
    public async listDatabases(opt?: ScanOptions): Promise<string[]> {
        const options = this.mergeOptions(opt);

        let databases: string[];
        if (options.useCache) {
            databases = this.cache.listDatabases();
        }
        if (!databases) {
            if (!this.database.connected) {
                await this.database.connect();
            }
            databases = await this.database.listDatabases();
            if (!this.persistentConnected) {
                await this.database.disconnect();
            }
            this.cache.cacheDatabases(databases);
        }
        databases = this.filterDatabases(databases, options);

        return databases;
    }

    /**
     * Retrieves the collections of the specified database as a promise to an array of strings.
     * @param database The database whose collections will be exported.
     * @param opt The [[ScanOptions]] options.
     * @returns A promise to an array of strings containing the retrieved collections.
     */
    public async listCollections(database: string, opt?: ScanOptions): Promise<string[]> {
        const options = this.mergeOptions(opt);

        let collections: string[];
        if (options.useCache) {
            collections = this.cache.listCollections(database);
        }
        if (!collections) {
            if (!this.database.connected) {
                await this.database.connect();
            }
            collections = await this.database.listCollections(database);
            if (!this.persistentConnected) {
                await this.database.disconnect();
            }
            this.cache.cacheCollections(database, collections);
        }
        collections = this.filterCollections(collections, options);

        return collections;
    }

    /**
     * Retrieves the schema of a mongodb database as a promise to a [[DatabaseSchema]] object.
     * @param opt The [[ScanOptions]] options.
     * @returns A promise to a [[DatabaseSchema]] object representing the database schema. The 
     * keys are the databases and their values the collections of the database as an array of strings
     */
    public async getSchema(opt?: ScanOptions): Promise<DatabaseSchema> {
        const options = this.mergeOptions(opt);
        const keepConnection = this.persistentConnected;
        let schema: DatabaseSchema = {};

        if (!this.database.connected) {
            await this.startConnection();
        }

        const databases = await this.listDatabases(options);
        for (const database of databases) {
            schema[database] = await this.listCollections(database, options);
        }

        if (!keepConnection) {
            await this.endConnection();
        }
        
        return schema;
    }

    /**
     * Clears the cache, which contains the results of the previous executions of 
     * the [[MongoScanner]] instance.
     */
    public clearCache(): void {
        this.cache.refreshCache();
    }

}