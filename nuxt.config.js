export default {
	// Target (https://go.nuxtjs.dev/config-target)

	target:"server",

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: "outscore",
		meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { hid: "description", name: "description", content: "" }],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [
		
	],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: ["@nuxtjs/composition-api"],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		// https://go.nuxtjs.dev/pwa
		"@nuxtjs/pwa",
		// https://go.nuxtjs.dev/content
		"@nuxt/content",
	],

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {
		proxy: true,
	},

	proxy: {
		"/api/": {
			target: "localhost:8888/.netlify/functions/api",
			pathRewrite: { "^/api/": "" },
		},
	},

	pwa: {
		workbox: {
			enabled: false,
			runtimeCaching: [
				{
					// Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
					urlPattern: "https://dog.ceo/api/breeds/image/random",
					handler: "cacheFirst",
					method: "GET",
					strategyOptions: {
						cacheName: "my-api-cache",
						cacheableResponse: { statuses: [0, 200] },
					},
					// Defaults to `NetworkFirst` if omitted
					// handler: 'NetworkFirst',
					// Defaults to `GET` if omitted
					// method: 'GET'
				},
			],
		},
	},

	generate: {
		fallback: true,
	},
	// Content module configuration (https://go.nuxtjs.dev/content-config)
	content: {},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {},
};
