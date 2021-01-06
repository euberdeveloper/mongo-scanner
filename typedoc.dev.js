module.exports = {
    entryPoints: [
        './source'
    ],
    name: 'mongo-scanner - DEV',
    includeVersion: true,
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    out: './docs/documentation/html-dev'
};