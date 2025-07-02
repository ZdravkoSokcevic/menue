import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            // buildDirectory: 'js/app',
            input: [
                'resources/sass/app.scss',
                'resources/js/app.ts',
            ],
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: true,
    //     strictPort: true,
    //     port: 8080
    // },
    define: {
        _global: ({})
    }
});
