import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            // buildDirectory: 'js/app',
            input: [
                'resources/sass/app.scss',
                'resources/sass/homepage/tailwind.css',
                'resources/sass/homepage/app.scss',
                'resources/sass/menu.scss',
                'resources/js/app.ts', // React admin entry
                'resources/js/svelte/App.js', // Svelte entry
                'resources/js/libs/alpine.js',
            ],
            refresh: true,
        }),
        react(),
        svelte(),
    ],

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    reactVendor: ["react", "react-dom"],
                    svelteVendor: ["svelte"]
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: [
                    'color-functions',
                    'global-builtin',
                    'mixed-decls',
                    'import'
                ]
            }
        }
    },
    server: {
        fs: {
            allow: ['..']
        }
        // host: true,
        // strictPort: true,
        // port: 8080
    },
    define: {
        _global: ({})
    }
});
