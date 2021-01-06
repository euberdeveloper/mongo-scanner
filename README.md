![Test](https://github.com/euberdeveloper/mongo-scanner/workflows/Test/badge.svg)
![Lint](https://github.com/euberdeveloper/mongo-scanner/workflows/Lint/badge.svg)
[![Build Status](https://travis-ci.org/euberdeveloper/mongo-scanner.svg?branch=master)](https://travis-ci.org/euberdeveloper/mongo-scanner)
[![Coverage Status](https://coveralls.io/repos/github/euberdeveloper/mongo-scanner/badge.svg?branch=master)](https://coveralls.io/github/euberdeveloper/mongo-scanner?branch=master)
[![Codecov Status](https://codecov.io/gh/euberdeveloper/mongo-scanner/branch/master/graph/badge.svg)](https://codecov.io/gh/euberdeveloper/mongo-scanner)
[![Known Vulnerabilities](https://snyk.io/test/github/euberdeveloper/mongo-scanner/badge.svg?targetFile=package.json)](https://snyk.io/test/github/euberdeveloper/mongo-scanner?targetFile=package.json)
[![dependencies Status](https://david-dm.org/euberdeveloper/mongo-scanner/status.svg)](https://david-dm.org/euberdeveloper/mongo-scanner)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![GitHub issues](https://img.shields.io/github/issues/euberdeveloper/mongo-scanner.svg)](https://github.com/euberdeveloper/mongo-scanner/issues)
[![Types](https://img.shields.io/npm/types/mongo-scanner.svg)](https://www.npmjs.com/package/mongo-scanner)
[![License](https://img.shields.io/npm/l/mongo-scanner.svg?color=blue)](https://github.com/euberdeveloper/mongo-scanner/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/euberdeveloper/mongo-scanner.svg)](https://github.com/euberdeveloper/mongo-scanner/stargazers)
![npm](https://img.shields.io/npm/v/mongo-scanner.svg)
[![Test Coverage](https://api.codeclimate.com/v1/badges/529f6967d2bb067049f7/test_coverage)](https://codeclimate.com/github/euberdeveloper/mongo-scanner/test_coverage)

# mongo-scanner
An npm module to retrieve the databases and the collections of a mongodb.

## Install

To install mongo-scanner as a local module:

```bash
$ npm install mongo-scanner
```

## Usage

### Listing databases

With default connection and configurations:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const databases = await scanner.listDatabases();
```

With custom connection:

```js
const { MongoScanner } = require('mongo-scanner');
const uri = 'mongodb://localhost:27017';
const connectionOptions = { numberOfRetries: 3 };
const scanner = new MongoScanner(uri, connectionOptions);

const databases = await scanner.listDatabases();
```

Excluding databases:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const options = { excludeDatabases: [ 'people', /^test/i ]};
const databases = await scanner.listDatabases(options);
```

Using cache:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

// Will use connection
let databases = await scanner.listDatabases();
// Will use another connection
databases = await scanner.listDatabases();
// Will use precedent cached result
databases = await scanner.listDatabases({ useCache: true });
```

### Listing collections

With default connection and configurations:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const collections = await scanner.listCollections('myDatabase');
```

With custom connection:

```js
const { MongoScanner } = require('mongo-scanner');
const uri = 'mongodb://localhost:27017';
const connectionOptions = { numberOfRetries: 3 };
const scanner = new MongoScanner(uri, connectionOptions);

const collections = await scanner.listCollections('myDatabase');
```

Excluding collections:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const options = { excludeCollections: [ 'students', /^test/i ]};
const collections = await scanner.listCollections('myDatabase', options);
```

Excluding system collections:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const options = { excludeSystem: true };
const collections = await scanner.listCollections('myDatabase', options);
```

Using cache:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

// Will use connection
let collections = await scanner.listCollections('myDatabase');
// Will use another connection
collections = await scanner.listCollections('myDatabase');
// Will use precedent cached result
collections = await scanner.listCollections('myDatabase', { useCache: true });
```

### Getting database schema

With default connection and configurations:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const schema = await scanner.getSchema();
```

With custom connection:

```js
const { MongoScanner } = require('mongo-scanner');
const uri = 'mongodb://localhost:27017';
const connectionOptions = { numberOfRetries: 3 };
const scanner = new MongoScanner(uri, connectionOptions);

const schema = await scanner.getSchema();
```

Excluding databases and collections:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

const options = { 
    excludeDatabases: [ 'fruits', /^[0-9]/i ],
    excludeCollections: [ 'students' ],
    excludeSystem: true,
    excludeEmptyDatabases: true
};
const schema = await scanner.getSchema(options);
```

Using cache:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

// Will use connection
let schema = await scanner.getSchema();
// Will use another connection
schema = await scanner.getSchema();
// Will use precedent cached result
schema = await scanner.getSchema({ useCache: true });
```

### Other features

Changing default option values:

```js
const { MongoScanner } = require('mongo-scanner');
const defaultOptions = { useCache: true };
const scanner = new MongoScanner(null, null, defaultOptions);
```

Using a persistent connection:

```js
const { MongoScanner } = require('mongo-scanner');
const scanner = new MongoScanner();

await scanner.startConnection();
const databases = await scanner.listDatabases();
const collections = await scanner.listCollections('myDatabase');
const schema = await scanner.getSchema();
await scanner.endConnection();
```

## Result

The `listDatabases` method returns a result like this:

```json
[ "admin", "people", "animals", "fruits" ]
```

The `listCollections` method returns a result like this:

```json
[ "dogs", "cats", "rabbits", "mouses" ]
```

The `getSchema` method returns a result like this:

```json
{
    "admin": [ "system.versions" ],
    "animals": [ "dogs", "cats", "rabbits", "mouses" ],
    "people": [ "students", "teachers", "musicians" ]
}
```

## API

### MongoScanner

The MongoScanner class, to retrieve the database schema or to list databases and collections of a MongoDB database.

### MongoScanner.constructor

**Syntax:**

`new MongoScanner(uri, connectionOptions, options)`

**Description:**

The constructor of the `MongoScanner` class. The params are the uri and options for the database connections. The connection is not established by the constructor, the connection parameters are only saved in the `MongoScanner` instance.

**Parameters:**

* __uri__: Optional. The `string` uri of the mongodb connection. Default: `mongodb://localhost:27017`.
* __connectionOptions__: Optional. The options object of the mongodb connection. The npm mongodb module is used under the hood and this is the object provided to MongoClient. Default: `{ }`.
* __options__: Optional. The `ScanOptions` object options that will be used as a fallback for the `ScanOptions`. For all the keys that will not be present in the options provided to a method that retrieves database or collections, the values provided here will be used instead of the default ones. Default: `{ }`.

**ScanOptions parameters:**

* __useCache__: Default value: `false`. If you want to use the cache before starting a database connection. When true, all the previous executions of the `MongoScanner` instance will be checked before establishing a new database connection. The cache is update every time an execution retrieves data form the database connection.
* __excludeDatabases__: Default value: `undefined`. Databases that you want to exclude from the result. You can provide a `string`, a `Regexp` or an `array` of both. A database will be removed from the result if it is equal to a string or matches a Regexp.
* __excludeCollections__: Default value: `undefined`. Collections that you want to exclude from the result. You can provide a `string`, a `Regexp` or an `array` of both. A collection will be removed from the result if it is equal to a string or matches a Regexp.
* __excludeSystem__: Default value: `false`. If you want system collections to be excluded by the result.
* __excludeEmptyDatabases__: Default value: `false`. If you want to exclude empty databases from the result of the method "getSchema()". NB: Database that are not empty but whose collections are excluded by other options such as excludeSystem or excludeCollections will be considered as empty.
* __ignoreLackOfPermissions__: Default value: `false`. If you want to ignore and not throw an error occurred when trying to list databases or collections but the connection had not permission to do it. NB: Actually, this will ignore all the errors that will occur when listing database or collections.
* __throwIfNotTotal__: Default value: `() => { }`. The `LackOfpermissionsCallback` callback called if an error occurred when trying to list databases or collectionsbut the connection had not permission to do it. NB: Actually, this will be called for all the errors that will occur when listing database or collections. 

**LackOfpermissionsCallback**

Parameters:

* __db__: Type: `string`. If the error happened when listing collections, the db is the database whose collections  were tried to be provided
* __error__: The error that happened. It is of type `ListDatabasesError` if it happened when listing databases and it is of type `ListCollectionsError` if it happened when listing collections.

### MongoScanner.listDatabases

**Syntax:**

`listDatabases(options)`

**Description:**

Retrieves the databases of a mongodb as a promise to an array of strings.

**Parameters:**

* __options__: Optional. The `ScanOptions` options. See above to find more details about `ScanOptions`.

**Result:**

A promise to an array of strings containing the retrieved databases.

### MongoScanner.listCollections

**Syntax:**

`listCollections(database, options)`

**Description:**

Retrieves the collections of the specified database as a promise to an array of strings.

**Parameters:**

* __database__: The database whose collections will be exported.
* __options__: Optional. The `ScanOptions` options. See above to find more details about `ScanOptions`.

**Result:**

A promise to an array of strings containing the retrieved collections.

### MongoScanner.getSchema

**Syntax:**

`getSchema(options)`

**Description:**

Retrieves the schema of a mongodb database as a promise to a `DatabaseSchema` object.

**Parameters:**

* __options__: Optional. The `ScanOptions` options. See above to find more details about `ScanOptions`.

**Result:**

A promise to a `DatabaseSchema` object representing the database schema. The keys are the databases and their values the collections of the database as an array of strings

### MongoScanner.startConnection

**Syntax:**

`startConnection()`

**Description:**

Starts a persistent connection to mongodb. By default, all methods that retrieve databases or collections from the mongodb open a connection before beginning and close it after finishing. This method allows you to have a persistent connection instead and is useful if you need to perform more than an operation and do not want to open and close connections for each of them.

**Result:**

A `void Promise`.

### MongoScanner.endConnection

**Syntax:**

`endConnection()`

**Description:**

Closes an already open persistent connection.

**Result:**

A `void Promise`.

**Result:**

A `void Promise`.

### MongoScanner.clearCache

**Syntax:**

`clearCache()`

**Description:**

Clears the cache, which contains the results of the previous executions of the `MongoScanner` instance. It is a synchronous method and returns nothing.

## Project structure

Made with **[dree](https://www.npmjs.com/package/dree)**.

```
mongo-scanner
 ├─> dist
 │   ├─> source
 │   └─> test
 ├─> source
 │   ├─> errors
 │   │   ├── connectionError.ts
 │   │   ├── disconnectionError.ts
 │   │   ├── index.ts
 │   │   ├── listCollectionsError.ts
 │   │   ├── listDatabasesError.ts
 │   │   └── mongoScannerError.ts
 │   ├── index.ts
 │   ├── tsconfig.json
 │   └─> utils
 │       ├── cache.ts
 │       └── database.ts
 ├─> test
 │   ├─> clearCache
 │   │   ├── clearCache.test.ts
 │   │   └── database-schema.test.json
 │   ├─> getSchema
 │   │   ├─> expected
 │   │   │   ├── first.test.json
 │   │   │   ├── second.test.json
 │   │   │   └── third.test.json
 │   │   └── getSchema.test.ts
 │   ├─> listCollections
 │   │   └── listCollections.test.ts
 │   ├─> listDatabases
 │   │   └── listDatabases.test.ts
 │   ├─> mock
 │   ├─> persistentConnection
 │   │   ├── database-schema.test.json
 │   │   └── persistentConnection.test.ts
 │   ├── test.ts
 │   ├── tsconfig.json
 │   └─> utils
 │       ├── benchmark.ts
 │       └── orderObject.ts
 ├─> docs
 │   └─> tree
 │       ├── dree.config.json
 │       └── tree.txt
 ├── LICENSE
 ├── README.md
 ├── package-lock.json
 ├── package.json
 └── tslint.json
```

## Build

To build the module make sure you have Typescript installed or install the dev dependencies. After this, run:

```bash
$ npm run transpile
```

The `source` folder will be compiled in the `dist` folder.

## Dev

Make sure you have the dev dependencies installed.

To lint the code go to the package root in your CLI and run

```bash
$ npm run lint
```

To run tests go to the package root in your CLI and run

```bash
$ npm run db:populate
$ npm test
```

**Note: Running tests will delete permanently your MongoDB data. Do not do it if you have important data on it.**
