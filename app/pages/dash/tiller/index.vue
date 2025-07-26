<script lang="ts" setup>
import { SearchTillerAccRecordsDocument, SortOrder, type SearchTillerAccRecordsQuery, type SearchTillerAccRecordsQueryVariables } from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData,	pending } = await useLazyAsyncData('hometillerdata', () => request<SearchTillerAccRecordsQuery, SearchTillerAccRecordsQueryVariables>(SearchTillerAccRecordsDocument, {
	orderBy: [{ id: SortOrder.Asc }]
}));
</script>

<template>
	<div>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
