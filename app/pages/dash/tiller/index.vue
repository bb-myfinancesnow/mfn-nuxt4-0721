<script lang="ts" setup>
import {
	SearchTillerCatRecordsDocument,
	SortOrder,
	type SearchTillerCatRecordsQueryVariables,
	type SearchTillerCatRecordsQuery
} from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData, pending } = await useLazyAsyncData(
	'hometillerdatac',
	() =>
		request<
			SearchTillerCatRecordsQuery,
			SearchTillerCatRecordsQueryVariables
		>(SearchTillerCatRecordsDocument, {
			orderBy: [{ id: SortOrder.Asc }]
		})
);
</script>

<template>
	<div>
		<DisplaySpinner
			:size="60"
			variant="pulse"
			text="Loading..."
		/>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
