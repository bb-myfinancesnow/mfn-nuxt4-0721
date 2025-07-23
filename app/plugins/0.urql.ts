import { createClient, fetchExchange, cacheExchange } from '@urql/vue';

export default defineNuxtPlugin((nuxtApp) => {
	const client = createClient({
		url: 'http://localhost:3004/api/graphql',
		exchanges: [
			fetchExchange,
			cacheExchange
		]
	});

	nuxtApp.vueApp.provide('$urql', client);
});
