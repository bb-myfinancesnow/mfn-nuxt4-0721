<script lang="ts" setup>
import {
	SearchTillerAccRecordsDocument,
	SortOrder,
	type SearchTillerAccRecordsQueryVariables,
	type SearchTillerAccRecordsQuery
} from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData, pending } = await useLazyAsyncData(
	'listtilleraccs',
	() =>
		request<
			SearchTillerAccRecordsQuery,
			SearchTillerAccRecordsQueryVariables
		>(SearchTillerAccRecordsDocument, {
			orderBy: [{ id: SortOrder.Asc }]
		}),
	{
		transform: (input) => {
			const arrSchema = TillerAccRecordSchema.array();
			const parsedData = arrSchema.parse(input.tillerAccounts);
			return parsedData;
		}
	}
);
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
