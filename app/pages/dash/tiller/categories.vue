<script lang="ts" setup>
import {
	SearchTillerCatRecordsDocument,
	SortOrder,
	type SearchTillerCatRecordsQueryVariables,
	type SearchTillerCatRecordsQuery,
	NullsOrder
} from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData, pending } = await useLazyAsyncData(
	'listtillercats',
	() =>
		request<
			SearchTillerCatRecordsQuery,
			SearchTillerCatRecordsQueryVariables
		>(SearchTillerCatRecordsDocument, {
			orderBy: [{ glAccountNumber: { sort: SortOrder.Asc, nulls: NullsOrder.First } }, { id: SortOrder.Asc }]
		}),
	{
		transform: (input): TTillerCatRecordSchema[] => {
			const arrSchema = TillerCatRecordSchema.array();
			return arrSchema.parse(input.tillerCategories);
		}
	}
);
</script>

<template>
	<div>
		<UPageCard title="Tiller Categories">
			<div>card</div>
		</UPageCard>
		<div>
			<DisplaySpinner
				v-if="pending || !tillerData"
				:size="60"
				variant="pulse"
				text="Loading..."
			/>
			<TillerCatGrid v-else :is-loading="pending" :category-records="tillerData" />
		</div>
		<!-- <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid> -->
	</div>
</template>
