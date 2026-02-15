/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    rootDir: '.',
    moduleNameMapper: {
        '@fe/(.*)': '<rootDir>/src/$1',
    },

    clearMocks: true,

    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    testEnvironment: 'jsdom',
};

export default config;
