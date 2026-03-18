const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const melluinRules = require('../../eslint.config');

module.exports = tseslint.config(
    {
        files: ['src/**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: melluinRules.tsSourceRules
    },
    {
        files: ['src/**/*.spec.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.spec.json',
            },
        },
        rules: melluinRules.tsTestRules,
    },
);