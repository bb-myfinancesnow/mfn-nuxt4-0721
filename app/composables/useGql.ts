import { GraphQLClient, type RequestDocument, type Variables } from 'graphql-request';

export const useGql = () => {
	const config = useRuntimeConfig();
	const { $graphql } = useNuxtApp();

	// Create a reactive client that can be updated with auth tokens
	const client = ref<GraphQLClient>($graphql);

	const setAuthToken = (token: string) => {
		client.value = new GraphQLClient(config.public.gqlClientUrl, {
			headers: {
				authorization: `Bearer ${token}`
			}
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const request = async <T = any, V extends Variables = Variables>(
		document: RequestDocument,
		variables?: V
	): Promise<T> => {
		try {
			// if (variables) {
			// 	return await client.value.request<T, V>(document, variables);
			// } else {
			// 	return await client.value.request<T>(document);
			// }
			return await client.value.request({
				document: document,
				variables
			});
		} catch (error) {
			console.error('GraphQL Error:', error);
			throw error;
		}
	};

	return {
		client: readonly(client),
		setAuthToken,
		request
	};
};
