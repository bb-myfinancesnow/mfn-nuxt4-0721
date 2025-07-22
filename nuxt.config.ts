// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/ui-pro',
		'@nuxt/content',
		'@vueuse/nuxt',
		'nuxt-og-image',
		'@nuxtjs/apollo'
	],

	devtools: { enabled: true },

	css: ['~/assets/css/main.css'],
	content: {
		preview: {
			api: 'https://api.nuxt.studio'
		}
	},
	runtimeConfig: {
		apiToken: process.env.API_TOKEN,
		public: {
			graphqlEndpoint: process.env.GRAPHQL_ENDPOINT
		}
	},

	routeRules: {
		'/docs': { redirect: '/docs/getting-started', prerender: false }
	},

	compatibilityDate: '2025-07-15',

	nitro: {
		prerender: {
			routes: [
				'/'
			],
			crawlLinks: true
		}
	},

	typescript: {
		typeCheck: true
	},
	apollo: {
		clients: {
			default: {
				httpEndpoint: 'http://localhost:3004/api/graphql'
			}
		}
	},

	eslint: {
		config: {
			stylistic: {
				commaDangle: 'never',
				braceStyle: '1tbs',
				semi: true,
				quoteProps: 'as-needed',
				arrowParens: true,
				indent: 'tab'
			}
		}
	}
});
