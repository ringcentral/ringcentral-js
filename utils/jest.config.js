module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    globals: {},
    testMatch: ['**/src/**/*-spec.ts'],
    reporters: ['default'],
    testEnvironment: process.env.JEST_ENV || 'node',
    maxConcurrency: 1,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/test.ts'],
};
