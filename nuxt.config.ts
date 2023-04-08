import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({

    // disable SSR
    ssr: false,
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/image-edge',
        'nuxt-graphql-server'
    ],
    buildModules: [
        '@nuxt/image-edge',
        ['@nuxt-modules/compression', {
          // options
        }]
    ],
    graphqlServer: {
        // Optional: config
        url: '/api/graphql',
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.GRAPHQL_ENDPOINT
        }
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            title: 'Liège Poker Club',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            htmlAttrs: {
                lang: 'fr',
            },
            meta: [
              // <meta name="viewport" content="width=device-width, initial-scale=1">
              { name: 'description', content: 'le LPC, la référence du poker à Liège dans un lieu accueillant dédié à notre passion. Un programme poker varié, un ranking, des interéquipes et bien plus. ' },
            ],
            script: [
              // <script src="https://myawesome-lib.js"></script>
              //{ src: 'https://awesome-lib.js' }
              //<script src="js/lottie.js" type="text/javascript"></script>
              //{ src: 'js/lottie.js', type: "text/javascript" }
            ],
            link: [
              // <link rel="stylesheet" href="https://myawesome-lib.css">
              //{ rel: 'stylesheet', href: 'https://awesome-lib.css' }
            ],
            noscript: [
              // <noscript>Javascript is required</noscript>
              { children: 'Javascript is required' }
            ]
          }
    },
})
