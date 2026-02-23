module.exports = {
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
