export default {
	// Target (https://go.nuxtjs.dev/config-target)

	target: "universal",

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: "outscore",
		meta: [{
			charset: "utf-8"
		}, {
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		}, {
			hid: "description",
			name: "description",
			content: ""
		}],
		link: [{
			rel: "icon",
			type: "image/x-icon",
			href: "/favicon.ico"
		}],
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [

	],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: ["@nuxtjs/composition-api", '@aceforth/nuxt-optimized-images', 'nuxt-lazy-load'],

	optimizedImages: {
		optimizeImages: true,
		optimizeImagesInDev: true,
		webp: {
			preset: 'default',
			quality: 100,
		},
	},

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
			target: "https://outscore-test.netlify.app/.netlify/functions/api/",
			pathRewrite: {
				"^/api/": ""
			},
		},
	},

	pwa: {
		manifest: {
			name: 'Outscore',
			lang: 'en',
			useWebmanifestExtension: false
		}
	},

	generate: {
		fallback: true,
	},
	// Content module configuration (https://go.nuxtjs.dev/content-config)
	content: {},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {},
};