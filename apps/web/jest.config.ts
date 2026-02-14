/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    rootDir: '.',
    moduleNameMapper: {
        '@shared/(.*)': '<rootDir>/../api/src/shared/$1',
        '@fe/(.*)': '<rootDir>/src/$1',
        'class-validator': '<rootDir>/node_modules/class-validator/$1',
        'class-transformer': '<rootDir>/node_modules/class-transformer/$1',
        'tslib': '<rootDir>/node_modules/tslib/$1'
    },

    clearMocks: true,

    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    testEnvironment: 'jsdom',
};

export default config;
