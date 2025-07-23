import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:3004/api/graphql',
	overwrite: true,
	ignoreNoDocuments: true,
	documents: ['api/**/*.gql'],
	generates: {
		'./app/generated/graphql.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-urql'
			],
			config: {
				withHooks: false,
				withComposition: false,
				skipTypename: true,
				useTypeImports: true,
				urqlImportFrom: '@urql/vue',
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
