import { GraphQLClient } from 'graphql-request';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const clientUrl = config.public.gqlClientUrl;

	const gqlClient = new GraphQLClient(clientUrl);

	return {
		provide: {
			graphql: gqlClient
		}
	};
});
