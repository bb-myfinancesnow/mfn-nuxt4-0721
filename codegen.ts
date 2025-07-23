import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:3004/api/graphql',
	overwrite: true,
	documents: [
		'app/graphql/**/*.graphql',
		'app/graphql/**/*.gql'
		// 'components/**/*.vue',
		// 'pages/**/*.vue',
		// 'composables/**/*.ts'
	],
	ignoreNoDocuments: true, // for better experience with the watcher
	generates: {
		'app/types/graphql.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-vue-apollo'
			],
			config: {
				withCompositionFunctions: true,
				vueCompositionApiImportFrom: 'vue',
				skipTypename: true,
				useTypeImports: true,
				apolloClientInstanceImport: '@nuxtjs/apollo',
				scalars: {
					DateTime: { input: 'Date', output: 'string' },
					JSON: 'Record<string, unknown>'
				}
			}
		},
		'./app/api/': {
			preset: 'client',
			config: {
				useTypeImports: true,
				skipTypename: true,
				scalars: {
					DateTime: { input: 'Date', output: 'string' },
					JSON: 'Record<string, unknown>'
				}
			}
		}
	},
	hooks: {
		afterAllFileWrite: ['eslint --fix .']
	}
};

export default config;
