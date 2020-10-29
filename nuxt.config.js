export default {
    // Target (https://go.nuxtjs.dev/config-target)

    target: "server",

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: "outscore",
        meta: [
            {
                charset: "utf-8"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: ""
            }
        ],
        link: [
            {
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico"
            }
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        "@nuxtjs/composition-api",
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
        // https://go.nuxtjs.dev/content
        "@nuxt/content",
        "nuxt-lazy-load",
        "@nuxtjs/sitemap",
        "nuxt-precompress"
        // "@nuxtjs/robots"
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {
        proxy: true
    },

    proxy: {
        "/api/": {
            target: "https://outscore-test.netlify.app/.netlify/functions/api/",
            pathRewrite: {
                "^/api/": ""
            }
        }
    },

    sitemap: {
        hostname: "https://outscore-app.herokuapp",
        gzip: true,
        exclude: [""]
    },

    // robots: {
    // 	UserAgent: "*",
    // 	Disallow: "/"
    //   },

    pwa: {
        manifest: {
            name: "Outscore",
            lang: "en",
            useWebmanifestExtension: false
        }
    },

    generate: {
        fallback: true
    },
    // Content module configuration (https://go.nuxtjs.dev/content-config)
    content: {},

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {}
};
