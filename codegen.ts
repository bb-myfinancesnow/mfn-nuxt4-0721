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
				'typescript-graphql-request'
			],
			config: {

				skipTypename: true,
				useTypeImports: true,
				exportFragmentSpreadSubTypes: true,
				dedupeFragments: true,
				preResolveTypes: true,
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
