<script lang="ts" setup>
import type { DataTableFilterMeta } from 'primevue/datatable';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
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

const defaultFilters: DataTableFilterMeta = {
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	label: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	id: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	locked: { value: null, matchMode: FilterMatchMode.EQUALS },
	month: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }]
	},
	year: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }]
	},
	yearLabel: { value: null, matchMode: FilterMatchMode.IN },
	'_count.journals': {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	startDate: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }]
	},
	endDate: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }]
	}
};

const filters = ref();

const initFilters = () => {
	filters.value = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		id: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
		},
		'_count.tillerTrans': {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
		}

	};
};

initFilters();

const clearFilter = () => {
	filters.value = defaultFilters;
};
</script>

<template>
	<div>
		<PDataTable
			v-model:filters="filters"
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
			filter-display="menu"
			:global-filter-fields="['name', 'group', 'institution', 'id']"
		>
			<template #empty>
				No data found.
			</template>
			<template #loading>
				Loading data. Please wait.
			</template>
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
				<USeparator class="py-2" />
				<div class="flex flex-wrap items-center justify-between gap-2">
					<UInput
						v-model="filters['global'].value"
						placeholder="Keyword Search"
						icon="i-lucide-search"
					/>
					<PButton
						type="button"
						icon="pi pi-filter-slash"
						label="Clear"
						outlined
						@click="clearFilter()"
					/>
				</div>
			</template>
			<PColumn
				field="id"
				header="ID"
				data-type="numeric"
				filter-field="id"
				sortable
				frozen
			>
				<template #filter="{ filterModel }">
					<PInputNumber v-model="filterModel.value" />
				</template>
			</PColumn>

			<PColumn
				field="name"
				header="Name"
				data-type="text"
				style="min-width: 200px"
				sortable
			>
				<template #filter="{ filterModel }">
					<PInputText v-model="filterModel.value" type="text" placeholder="Search by label" />
				</template>
			</PColumn>
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
