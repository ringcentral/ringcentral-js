/* global jest */
// jest.setup.js
jest.setTimeout(50000);

if (process.env.JEST_ENV === 'node') {
    require('./src/index.ts');
}
