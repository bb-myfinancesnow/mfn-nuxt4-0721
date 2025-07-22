// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/ui-pro',
		'@nuxt/content',
		'@vueuse/nuxt',
		'nuxt-og-image'
	],

	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	compatibilityDate: '2025-07-15',
	typescript: {
		typeCheck: true
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
