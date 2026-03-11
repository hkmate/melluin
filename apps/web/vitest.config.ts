import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        typecheck: {
            tsconfig: './tsconfig.spec.json',
        },
        clearMocks: true,
        mockReset: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
        },
        alias: {
            "@fe/": `${__dirname}/src/` //new URL('./src/', __dirname).pathname,
        }
    }
})