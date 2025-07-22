import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:3004/api/graphql',
	documents: [
		'app/graphql/**/*.graphql',
		'app/graphql/**/*.gql',
		'components/**/*.vue',
		'pages/**/*.vue',
		'composables/**/*.ts'
	],
	generates: {
		'./types/graphql.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-vue-apollo'
			],
			config: {
				withCompositionFunctions: true,
				vueCompositionApiImportFrom: 'vue',
				skipTypename: false,
				useTypeImports: true,
				apolloClientInstanceImport: '@nuxtjs/apollo',
				scalars: {
					DateTime: 'string',
					JSON: 'Record<string, any>'
				}
			}
		}
	}
};

export default config;
