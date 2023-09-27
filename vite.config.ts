import react from '@vitejs/plugin-react';
/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';
import Copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        Copy({
            targets: [
                {
                    src: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                    dest: 'public/workers',
                },
            ],
        }),
    ],
    test: {
        exclude: [...configDefaults.exclude, 'e2e/*'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./config/setupTest.ts'],
    },
});
