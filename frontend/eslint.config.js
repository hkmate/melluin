const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const maxParamsNoConstr = require('eslint-plugin-max-params-no-constructor');

module.exports = tseslint.config(
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,

            // TODO: check rules and setup what it needed
            // ...angular.configs.tsRecommended,
        ],
        plugins: {
            'max-params-no-constructor': maxParamsNoConstr
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        processor: angular.processInlineTemplates,
        rules: {
            // '@angular-eslint/directive-selector': [
            //     'error',
            //     {
            //         type: 'attribute',
            //         prefix: 'app',
            //         style: 'camelCase',
            //     },
            // ],
            // '@angular-eslint/component-selector': [
            //     'error',
            //     {
            //         type: 'element',
            //         prefix: 'app',
            //         style: 'kebab-case',
            //     },
            // ],
            "@typescript-eslint/strict-boolean-expressions": [
                "error", {
                    "allowString": false,
                    "allowNumber": false,
                    "allowNullableBoolean": true
                }
            ],
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": [
                "error", {
                    "default": "generic",
                    "readonly": "generic"
                }
            ],
            "@typescript-eslint/ban-ts-comment": [
                "error", {
                    "ts-expect-error": "allow-with-description",
                    "ts-ignore": "allow-with-description",
                    "ts-nocheck": false,
                    "ts-check": false,
                    "minimumDescriptionLength": 10
                }
            ],
            "@typescript-eslint/class-literal-property-style": ["error", "fields"],
            "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    "allowExpressions": true
                }
            ],
            "@typescript-eslint/explicit-member-accessibility": [
                "error", {
                    "accessibility": "explicit",
                    "overrides": {
                        "accessors": "explicit",
                        "constructors": "no-public",
                        "methods": "explicit",
                        "properties": "off",
                        "parameterProperties": "explicit"
                    }
                }
            ],
            "@typescript-eslint/no-empty-function": ["error", {
                "allow": ["overrideMethods"]
            }
            ],
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-invalid-void-type": "off",
            "@typescript-eslint/no-unused-vars": [
                "error", {
                    "args": "none"
                }
            ],
            "@typescript-eslint/no-magic-numbers": [
                "warn", {
                    "ignore": [0, 1],
                    "ignoreReadonlyClassProperties": true,
                    "ignoreClassFieldInitialValues": true,
                    "ignoreArrayIndexes": true,
                    "ignoreDefaultValues": true
                }
            ],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-inferrable-types": ["error", {
                ignoreParameters: true,
                ignoreProperties: true
            }],
            "quotes": ["error", "single"],
            "no-constructor-return": ["error"],
            "no-duplicate-imports": ["error"],
            "no-promise-executor-return": ["error"],
            "no-self-compare": ["error"],
            "no-template-curly-in-string": ["error"],
            "no-unmodified-loop-condition": ["error"],
            "no-unreachable-loop": ["error"],
            "no-unused-vars": "off",
            "arrow-body-style": ["error", "as-needed"],
            "block-scoped-var": ["error"],
            "consistent-return": [
                "error", {
                    "treatUndefinedAsUnspecified": false
                }
            ],
            "curly": ["error"],
            "default-case": ["off"],
            "default-case-last": ["error"],
            "default-param-last": ["off"],
            "dot-notation": [
                "error", {
                    "allowKeywords": true
                }
            ],
            "eqeqeq": ["error", "always"],
            "max-lines": ["warn", 300],
            "max-lines-per-function": ["warn", 15],
            "max-params": "off",
            "max-params-no-constructor/max-params-no-constructor": ["warn", 3],
            "no-bitwise": ["error"],
            "no-caller": ["error"],
            "no-confusing-arrow": [
                "error", {
                    "allowParens": true
                }
            ],
            "no-else-return": [
                "error", {
                    "allowElseIf": true
                }
            ],
            "no-extend-native": ["error"],
            "no-labels": ["error"],
            "no-invalid-this": ["error"],
            "no-iterator": ["error"],
            "no-lone-blocks": ["error"],
            "no-lonely-if": ["error"],
            "no-loop-func": ["error"],
            "no-magic-numbers": ["off"],
            "no-multi-assign": ["error"],
            "no-return-assign": ["error"],
            "no-sequences": ["error"],
            "no-useless-concat": ["error"],
            "no-useless-constructor": "off",
            "no-var": ["error"],
            "no-void": ["error"],
            "operator-assignment": ["error", "always"],
            "prefer-arrow-callback": ["error"],
            "prefer-const": ["error"],
            "prefer-rest-params": ["error"],
            "prefer-spread": ["error"],
            "require-await": ["error"],
            "array-bracket-spacing": ["error", "never"],
            "arrow-parens": ["error", "as-needed"],
            "arrow-spacing": [
                "error", {
                    "before": true,
                    "after": true
                }
            ],
            "block-spacing": ["error", "always"],
            "brace-style": [
                "error", "1tbs", {
                    "allowSingleLine": true
                }
            ],
            "comma-style": ["error", "last"],
            "comma-spacing": [
                "error", {
                    "before": false,
                    "after": true
                }
            ],
            "computed-property-spacing": ["error", "never"],
            "eol-last": ["error", "always"],
            "func-call-spacing": ["error", "never"],
            "key-spacing": [
                "error", {
                    "beforeColon": false,
                    "afterColon": true
                }
            ],
            "lines-between-class-members": [
                "error", "always", {
                    "exceptAfterSingleLine": true
                }
            ],
            "no-tabs": ["error"],
            "no-trailing-spaces": ["error"],
            "no-whitespace-before-property": ["error"],
            "operator-linebreak": ["error", "before"],
            "padded-blocks": [
                "error", {
                    "classes": "always",
                    "blocks": "never",
                    "switches": "never"
                }
            ],
            "rest-spread-spacing": ["error", "never"],
            "semi-spacing": [
                "error", {
                    "before": false,
                    "after": true
                }
            ],
            "semi-style": ["error", "last"],
            "space-before-blocks": ["error"],
            "space-in-parens": ["error", "never"]

        },
    },
    // {
    //     files: ['**/*.html'],
    //     extends: [
    //         ...angular.configs.templateRecommended,
    //         ...angular.configs.templateAccessibility,
    //     ],
    //     rules: {},
    // },

    {
        files: ['**/*.spec.ts'],
        rules: {
            "max-lines-per-function": "off",
            "@typescript-eslint/no-magic-numbers": "off",
            "max-lines": "off",
            "no-undefined": "off"
        },
    },
);