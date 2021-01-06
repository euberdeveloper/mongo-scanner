/* eslint-disable @typescript-eslint/no-empty-function */
export * from '@/errors';

import { Database } from '@/utils/database';
import { Cache } from '@/utils/cache';
import { ListDatabasesError, ListCollectionsError } from '@/errors';

/**
 * The type of the callback called when there is an error in listing databases or collections.
 * @param db If the error happened when listing collections, the db is the database whose collections
 * were tried to be provided
 * @param error The error that happened. It is of type [[ListDatabasesError]] if it happened when
 * listing databases and it is of type [[ListCollectionsError]] if it happened when
 * listing collections.
 */
export type LackOfPermissionsCallback = (db: string, error: ListDatabasesError | ListCollectionsError) => void;

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
    /**
     * If you want to exclude empty databases from the result of the method "getSchema()"
     *
     * NB: Database that are not empty but whose collections are excluded by other options such as
     * excludeSystem or excludeCollections will be considered as empty.
     *
     * Default: false
     */
    excludeEmptyDatabases?: boolean;
    /**
     * If you want to ignore and not throw an error occurred when trying to list databases or collections
     * but the connection had not permission to do it.
     *
     * NB: Actually, this will ignore all the errors that
     * will occur when listing database or collections.
     *
     * Default: false
     */
    ignoreLackOfPermissions?: boolean;
    /**
     * The [[LackOfpermissionsCallback]] callback called if an error occurred when trying to list databases or collections
     * but the connection had not permission to do it.
     *
     * NB: Actually, this will be called for all the errors that
     * will occur when listing database or collections.
     *
     * Default: () => { }
     */
    onLackOfPermissions?: LackOfPermissionsCallback;
}

const DEFAULT_OPTIONS: ScanOptions = {
    useCache: false,
    excludeDatabases: undefined,
    excludeCollections: undefined,
    excludeSystem: false,
    excludeEmptyDatabases: false,
    ignoreLackOfPermissions: false,
    onLackOfPermissions: () => {}
};

/**
 * The MongoScanner class, to retrieve the database schema or to list databases and collections of
 * a MongoDB database.
 */
export class MongoScanner {
    private readonly cache: Cache;
    private database: Database;
    private persistentConnected: boolean;
    private persistentActives: number;

    private _uri: string;
    private _connectionOptions: any;
    private _options: ScanOptions;

    private get uri(): string {
        return this._uri;
    }
    private set uri(uri: string) {
        this._uri = uri || 'mongodb://localhost:27017';
    }

    private get connectionOptions(): any {
        return this._connectionOptions;
    }
    private set connectionOptions(connectionOptions: any) {
        this._connectionOptions = connectionOptions || {};
    }

    private get options(): ScanOptions {
        return this._options;
    }
    private set options(options: ScanOptions) {
        this._options = this.mergeOptionsWithDefault(options);
    }

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
    constructor(uri?: string, connectionOptions?: any, options?: ScanOptions) {
        this.uri = uri;
        this.connectionOptions = connectionOptions;
        this.options = options;

        this.database = null;
        this.cache = new Cache();
        this.persistentConnected = false;
        this.persistentActives = 0;
    }

    private mergeOptionsWithDefault(options: ScanOptions): ScanOptions {
        options = options || {};
        const merged: ScanOptions = {};

        for (const key in DEFAULT_OPTIONS) {
            merged[key] = options[key] === undefined ? DEFAULT_OPTIONS[key] : options[key];
        }

        return merged;
    }

    private mergeOptions(options: ScanOptions): ScanOptions {
        options = options || {};
        const merged: ScanOptions = {};

        for (const key in this.options) {
            merged[key] = options[key] === undefined ? this.options[key] : options[key];
        }

        return merged;
    }

    private passes(item: string, excludes: (string | RegExp)[]): boolean {
        return excludes.every(exclude => (typeof exclude === 'string' ? item !== exclude : !exclude.test(item)));
    }

    private filterDatabases(databases: string[], options: ScanOptions): string[] {
        let result = databases;

        if (options.excludeDatabases) {
            const excludes = Array.isArray(options.excludeDatabases)
                ? options.excludeDatabases
                : [options.excludeDatabases];
            result = result.filter(database => this.passes(database, excludes));
        }

        return result;
    }

    private filterCollections(collections: string[], options: ScanOptions): string[] {
        let result = collections;

        if (options.excludeSystem) {
            result = result.filter(collection => !/^system./.test(collection));
        }
        if (options.excludeCollections) {
            const excludes = Array.isArray(options.excludeCollections)
                ? options.excludeCollections
                : [options.excludeCollections];
            result = result.filter(database => this.passes(database, excludes));
        }

        return result;
    }

    private async _listDatabases(options: ScanOptions, inheritDb: Database): Promise<string[]> {
        let databases: string[];
        if (options.useCache) {
            databases = this.cache.listDatabases();
        }
        if (!databases) {
            let database = inheritDb,
                persistent = false;
            if (!database) {
                if (this.persistentConnected) {
                    this.persistentActives++;
                    persistent = true;
                    database = this.database;
                } else {
                    database = new Database(this.uri, this.connectionOptions);
                    await Database.connectDatabase(database);
                }
            }

            try {
                databases = await database.listDatabases();
                this.cache.cacheDatabases(databases);
            } catch (error) {
                /* istanbul ignore next */
                const e = new ListDatabasesError(null, error);
                /* istanbul ignore next */
                options.onLackOfPermissions(null, e);
                /* istanbul ignore next */
                if (options.ignoreLackOfPermissions) {
                    return [];
                } else {
                    throw e;
                }
            } finally {
                let disconnect = inheritDb === null;
                if (persistent) {
                    this.persistentActives--;
                    disconnect = !this.persistentConnected && this.persistentActives === 0;
                }
                if (disconnect) {
                    await Database.disconnectDatabase(database);
                }
            }
        }
        databases = this.filterDatabases(databases, options);

        return databases;
    }

    private async _listCollections(db: string, options: ScanOptions, inheritDb: Database): Promise<string[]> {
        let collections: string[];
        if (options.useCache) {
            collections = this.cache.listCollections(db);
        }
        if (!collections) {
            let database = inheritDb,
                persistent = false;
            if (!database) {
                if (this.persistentConnected) {
                    this.persistentActives++;
                    persistent = true;
                    database = this.database;
                } else {
                    database = new Database(this.uri, this.connectionOptions);
                    await Database.connectDatabase(database);
                }
            }

            try {
                collections = await database.listCollections(db);
                this.cache.cacheCollections(db, collections);
            } catch (error) {
                /* istanbul ignore next */
                const e = new ListCollectionsError(null, db, error);
                /* istanbul ignore next */
                options.onLackOfPermissions(null, e);
                /* istanbul ignore next */
                if (options.ignoreLackOfPermissions) {
                    return [];
                } else {
                    throw e;
                }
            } finally {
                let disconnect = inheritDb === null;
                if (persistent) {
                    this.persistentActives--;
                    disconnect = !this.persistentConnected && this.persistentActives === 0;
                }
                if (disconnect) {
                    await Database.disconnectDatabase(database);
                }
            }
        }
        collections = this.filterCollections(collections, options);

        return collections;
    }

    /**
     * Starts a persistent connection to mongodb. By default, all methods that retrieve databases or
     * collections from the mongodb open a connection before beginning and close it after finishing.
     * This method allows you to have a persistent connection instead and is useful if you need to perform
     * more than an operation and do not want to open and close connections for each of them.
     */
    public async startConnection(): Promise<void> {
        this.database = new Database(this.uri, this.connectionOptions);
        await Database.connectDatabase(this.database);
        this.persistentConnected = true;
    }

    /**
     * Closes an already open persistent connection.
     */
    public async endConnection(): Promise<void> {
        this.persistentConnected = false;

        if (this.persistentActives === 0) {
            await Database.disconnectDatabase(this.database);
        }
    }

    /**
     * Retrieves the databases of a mongodb as a promise to an array of strings.
     * @param options The [[ScanOptions]] options.
     * @returns A promise to an array of strings containing the retrieved databases.
     */
    public async listDatabases(options?: ScanOptions): Promise<string[]> {
        const opt = this.mergeOptions(options);
        return this._listDatabases(opt, null);
    }

    /**
     * Retrieves the collections of the specified database as a promise to an array of strings.
     * @param database The database whose collections will be exported.
     * @param options The [[ScanOptions]] options.
     * @returns A promise to an array of strings containing the retrieved collections.
     */
    public async listCollections(database: string, options?: ScanOptions): Promise<string[]> {
        const opt = this.mergeOptions(options);
        return this._listCollections(database, opt, null);
    }

    /**
     * Retrieves the schema of a mongodb database as a promise to a [[DatabaseSchema]] object.
     * @param options The [[ScanOptions]] options.
     * @returns A promise to a [[DatabaseSchema]] object representing the database schema. The
     * keys are the databases and their values the collections of the database as an array of strings
     */
    public async getSchema(options?: ScanOptions): Promise<DatabaseSchema> {
        const opt = this.mergeOptions(options);
        let schema: DatabaseSchema = {};

        let database: Database, persistent: boolean;
        if (this.persistentConnected) {
            this.persistentActives++;
            persistent = true;
            database = this.database;
        } else {
            persistent = false;
            database = new Database(this.uri, this.connectionOptions);
            await Database.connectDatabase(database);
        }

        const databases = await this._listDatabases(opt, database);
        for (const db of databases) {
            schema[db] = await this._listCollections(db, opt, database);
            if (opt.excludeEmptyDatabases && !schema[db].length) {
                delete schema[db];
            }
        }

        let disconnect = true;
        if (persistent) {
            this.persistentActives--;
            disconnect = !this.persistentConnected && this.persistentActives === 0;
        }
        if (disconnect) {
            await Database.disconnectDatabase(database);
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
