import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{orange.50}',
			100: '{orange.100}',
			200: '{orange.200}',
			300: '{orange.300}',
			400: '{orange.400}',
			500: '{orange.500}',
			600: '{orange.600}',
			700: '{orange.700}',
			800: '{orange.800}',
			900: '{orange.900}',
			950: '{orange.950}'
		}
	}
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/ui-pro',
		'@nuxt/content',
		'@vueuse/nuxt',
		'nuxt-og-image',
		'@primevue/nuxt-module'
	],

	devtools: { enabled: true },

	css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],
	content: {
		preview: {
			api: 'https://api.nuxt.studio'
		}
	},

	runtimeConfig: {
		gqlServerUrl: '',
		public: {
			gqlClientUrl: ''
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
			]
		}
	},
	vite: {
		plugins: [tailwindcss()]
	},

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
	},
	primevue: {
		autoImport: true,
		options: {
			ripple: true,
			inputVariant: 'filled',
			theme: {
				preset: MyPreset,
				options: {
					prefix: 'p',
					darkModeSelector: 'system',
					cssLayer: false
				}
			}
		},
		components: {
			include: [
				'DataTable',
				'InputNumber',
				'Button',
				'Column',
				'InputText',
				'IconField',
				'Checkbox',
				'MultiSelect',
				'DatePicker',
				'InputIcon',
				'Select',
				'Row',
				'ColumnGroup'
			],
			prefix: 'P'
		},
		composables: {
			exclude: ['useToast']
		}
	}
});
