<script lang="ts" setup>
import {
	SearchTillerTranRecordsDocument,
	SortOrder,
	type SearchTillerTranRecordsQueryVariables,
	type SearchTillerTranRecordsQuery
} from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData, pending } = await useLazyAsyncData(
	'listtillertrans',
	() =>	request<
			SearchTillerTranRecordsQuery,
			SearchTillerTranRecordsQueryVariables
		>(SearchTillerTranRecordsDocument, {
		orderBy: [{ date: SortOrder.Desc },
			{ dateAdded: SortOrder.Desc },
			{ id: SortOrder.Asc }]
	}),
	{
		transform: (input): TTillerTranRecordSchema[] => {
			const arrSchema = TillerTranRecordSchema.array();
			return arrSchema.parse(input.tillerTrans);
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
			<TillerTranRecGrid v-else :is-loading="pending" :tran-records="tillerData" />
		</div>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
