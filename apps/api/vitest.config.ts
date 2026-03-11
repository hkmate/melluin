import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
    test: {
        typecheck: {
            tsconfig: './tsconfig.spec.json',
        },
        clearMocks: true,
        mockReset: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
        },
        alias: {
            "@be/": `${__dirname}/src/` //new URL('./src/', __dirname).pathname,
        }
    },
    plugins: [swc.vite()],
})