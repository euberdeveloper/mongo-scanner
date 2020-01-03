export interface CacheSchema {
    databases: string[];
    collections: {
        [database: string]: string[];
    };
}

export class Cache {

    private schema: CacheSchema;

    constructor() {
        this.schema = { databases: null, collections: { } };
    }

    public listDatabases(): string[] {
        return this.schema.databases;
    }

    public listCollections(database: string): string[] {
        return this.schema.collections[database] || null;
    }

    public cacheDatabases(databases: string[]): void {
        this.schema.databases = databases;
    }

    public cacheCollections(database: string, collections: string[]): void {
        this.schema.collections[database] = collections;
    }

    public refreshCache(): void {
        this.schema = { databases: null, collections: { } };
    }

}