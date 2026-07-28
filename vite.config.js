import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            // buildDirectory: 'public/js',
            input: [
                'resources/sass/app.scss',
                'resources/sass/homepage/tailwind.css',
                'resources/sass/homepage/app.scss',
                'resources/sass/homepage/home.scss',
                'resources/sass/homepage/details.scss',
                'resources/sass/homepage/cart.scss',
                'resources/sass/menu.scss',
                'resources/sass/discounts.scss',
                'resources/sass/menu_translation.scss',
                'resources/js/app.js', // React admin entry
                'resources/js/svelte/App.js', // Svelte entry
                'resources/js/libs/alpine.js',
            ],
            refresh: false,
        }),
        react(),
        svelte(),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    reactVendor: ["react", "react-dom"],
                    svelteVendor: ["svelte"]
                }
            }
        },
        // outDir: './public/js'
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
        },
        watch: {
            // Ignore everything EXCEPT .js and .ts files
            ignored: ['!**/*.js', '!**/*.ts'],
        },
        // host: 'localhost',
        host: true, // Tells Vite to listen on all local network addresses
        // // strictPort: true,
        port: 8080,
        hmr: {
            host: 'localhost',
            // port: 8080
        }
    },
    define: {
        _global: ({})
    }
});
