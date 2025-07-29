<script lang="ts" setup>
import {
	SortOrder,
	type GetBaseTillerRecInfoQuery,
	type GetBaseTillerRecInfoQueryVariables,
	GetBaseTillerRecInfoDocument,
	NullsOrder
} from '~/generated/graphql';

const { request } = useGql();

// const { data: tillerData, pending } = await useLazyAsyncData(
// 	'hometillerdatac',
// 	() =>
// 		request<
// 			SearchTillerCatRecordsQuery,
// 			SearchTillerCatRecordsQueryVariables
// 		>(SearchTillerCatRecordsDocument, {
// 			orderBy: [{ id: SortOrder.Asc }]
// 		})
// );

const homeTillerDataQueryVars = ref<GetBaseTillerRecInfoQueryVariables>({
	catOrderBy: [
		{ glAccountNumber: { sort: SortOrder.Asc, nulls: NullsOrder.First } },
		{ id: SortOrder.Asc }
	],
	accOrderBy: [{ glAccountNumber: SortOrder.Asc }, { id: SortOrder.Asc }],
	tranOrderBy: [
		{ date: SortOrder.Desc },
		{ dateAdded: SortOrder.Desc },
		{ id: SortOrder.Asc }
	]
});

const { data: homeTillerData, pending } = await useLazyAsyncData(
	`hometillerdashdata-${JSON.stringify(homeTillerDataQueryVars.value)}`,
	() =>
		request<GetBaseTillerRecInfoQuery, GetBaseTillerRecInfoQueryVariables>(
			GetBaseTillerRecInfoDocument,
			homeTillerDataQueryVars.value
		),
	{
		transform: (input): TBaseTillerInfosSchema => {
			return BaseTillerInfosSchema.parse(input);
		}
	}
);
</script>

<template>
	<div>
		<DisplaySpinner
			v-if="pending"
			:size="60"
			variant="pulse"
			text="Loading..."
		/>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ homeTillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
