import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint'],
    devtools: { enabled: true },
    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Krub:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap'
                }
            ]
        }
    },
    css: ['~/assets/css/main.css'],
    compatibilityDate: '2025-07-15',
    vite: {
        plugins: [tailwindcss()]
    },
    eslint: {
        config: {
            stylistic: true
        }
    }
});
