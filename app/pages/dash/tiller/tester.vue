<script lang="ts" setup>
import {
	SearchTillerAccRecordsDocument,
	SortOrder,
	type SearchTillerAccRecordsQueryVariables,
	type SearchTillerAccRecordsQuery
} from '~/generated/graphql';

const { request } = useGql();

const {
	data: tillerData,
	pending,
	refresh: refreshAccQuery
} = await useLazyAsyncData(
	'listtilleraccs',
	() =>
		request<
			SearchTillerAccRecordsQuery,
			SearchTillerAccRecordsQueryVariables
		>(SearchTillerAccRecordsDocument, {
			orderBy: [{ id: SortOrder.Asc }]
		}),
	{
		transform: (input): TTillerAccRecordSchema[] => {
			const arrSchema = TillerAccRecordSchema.array();
			const parsedData = arrSchema.parse(input.tillerAccounts);
			return parsedData;
		},
		default: () => [] as TTillerAccRecordSchema[]
	}
);
</script>

<template>
	<div>
		<PDataTable
			data-key="id"
			:loading="pending"
			:value="tillerData"
			table-style="min-width: 50rem"
			scrollable
			scroll-height="flex"
			resizable-columns
			paginator
			:rows="5"
			:rows-per-page-options="[5, 10, 20, 50]"
			sort-field="id"
			:sort-order="1"
			removable-sort
		>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">Accounts</span>
					<PButton
						icon="pi pi-refresh"
						rounded
						raised
						@click="refreshAccQuery()"
					/>
				</div>
			</template>
			<PColumn
				field="id"
				header="ID"
				data-type="numeric"
				sortable
			/>
			<PColumn
				field="name"
				header="Name"
				data-type="text"
				style="min-width: 200px"
				sortable
			/>
			<PColumn
				field="group"
				header="Group"
				data-type="text"
				style="min-width: 200px"
				sortable
			/>
			<PColumn
				field="institution"
				header="Institution"
				data-type="text"
				style="min-width: 200px"
				sortable
			/>
			<PColumn
				field="glAccount.accountLabel"
				header="GL Account"
				style="min-width: 200px"
				sortable
			/>
			<PColumn
				field="_count.tillerTrans"
				header="Tran Count"
				data-type="numeric"
				sortable
			/>
			<PColumn field="accountId" header="Acc ID" data-type="text" />
		</PDataTable>
	</div>
</template>
