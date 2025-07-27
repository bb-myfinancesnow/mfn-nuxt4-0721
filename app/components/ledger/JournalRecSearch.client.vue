<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type {
	DataTableFilterEvent,
	DataTableFilterMeta,
	DataTablePageEvent
} from 'primevue/datatable';
import { SourceType } from '~/generated/graphql';

interface Props {
	jeRecs: TJournalRecSchema[];
	isLoading: boolean;
}

const props = defineProps<Props>();

const tranSourceVals = Object.values(SourceType);

const columnDefs: IPrimeColumnDef<TJournalRecSchema>[] = [
	{
		colId: 'tranNumber',
		colType: 'integer',
		filterable: true,
		field: 'tranNumber',
		sortable: true,
		frozen: true,
		header: '#',
		displayLabel: '#',
		disableHide: true
	},
	{
		colId: 'tranDate',
		filterable: true,
		field: 'tranDate',
		sortable: true,
		header: 'Tran Date',
		style: 'min-width: 200px',
		displayLabel: 'Tran Date',
		disableHide: true,
		colType: 'date'
	},
	{
		colId: 'postingPeriod.label',
		field: 'postingPeriod.label',
		sortField: 'postingPeriod.id',
		header: 'Period',
		sortable: true,
		displayLabel: 'Period',
		colType: 'multiselect'
	},
	{
		colId: 'description',
		filterable: true,
		field: 'description',
		colType: 'text',
		header: 'Description',
		displayLabel: 'Description',
		globalFilterable: true
	},
	{
		colId: 'postingPeriod.locked',
		filterable: true,
		field: 'postingPeriod.locked',
		colType: 'boolean',
		header: 'Locked',
		displayLabel: 'Period Locked'
	},
	{
		colId: 'tranSource',
		field: 'tranSource',
		colType: 'tranSources',
		header: 'Source',
		displayLabel: 'Journal Source',
		filterable: true
	},
	{
		colId: '_count.entries',
		field: '_count.entries',
		colType: 'integer',
		header: 'Entry Count',
		displayLabel: 'Entry Count',
		sortable: true,
		filterable: true
	},
	{
		colId: 'id',
		filterable: true,
		field: 'id',
		colType: 'text',
		sortable: true,
		header: 'ID',
		displayLabel: 'ID',
		defaultHidden: true,
		globalFilterable: true
	}
];

const defaultFilters: DataTableFilterMeta = {
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	id: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
	},
	tranNumber: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	tranDate: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }]
	},
	description: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
	},
	'_count.entries': {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	'postingPeriod.locked': { value: null, matchMode: FilterMatchMode.EQUALS },
	tranSource: { value: null, matchMode: FilterMatchMode.IN }
};

const {
	columnOptions,
	visibleColumns,
	defaultRows,
	filters,
	globalFilterFieldKeys,
	initFilters,
	clearFilter,
	resetVisibleColumns,
	updateVisCols
} = usePrimeTable({ columnDefs, defaultFilters });

resetVisibleColumns();
initFilters();

const expandedRows = ref({});

const filteredRowCount = ref<number>(props.jeRecs.length);

const collapseAll = () => {
	expandedRows.value = {};
};

const pageEmit = (event: DataTablePageEvent) => {
	console.log(`pageemit`, event);
	collapseAll();
};

const filterEmit = (event: DataTableFilterEvent) => {
	console.log(`filterEmit`, event);
	const l = event.filteredValue.length;
	console.log(`filtered length is ${l} with type ${typeof l}`);

	if (l && typeof l === 'number') filteredRowCount.value = l;
};
</script>

<template>
	<PDataTable
		v-model:filters="filters"
		v-model:expanded-rows="expandedRows"
		:value="jeRecs"
		data-key="id"
		:loading="isLoading"
		table-style="min-width: 150rem"
		scrollable
		scroll-height="flex"
		resizable-columns
		removable-sort
		paginator
		sort-mode="multiple"
		:rows="defaultRows"
		:rows-per-page-options="[5, 10, 25, 50, 100]"
		filter-display="menu"
		:global-filter-fields="globalFilterFieldKeys"
		@page="pageEmit"
		@filter="filterEmit"
	>
		<template #empty>
			No data found.
		</template>
		<template #loading>
			Loading data. Please wait.
		</template>
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="flex flex-wrap justify-start gap-2">
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
				<TableColPickPrime
					:col-options="columnOptions"
					:visible-cols="visibleColumns"
					:loading="isLoading"
					:disabled="isLoading"
					@update-cols="
						(cols) =>
							updateVisCols(
								cols as IPrimeColumnConfig<TJournalRecSchema>[]
							)
					"
				/>
			</div>
			<USeparator class="py-2" />
			<div class="flex items-center justify-between gap-2">
				<DisplayCountto prefix="Total Journals: " :end-value="jeRecs.length" />
				<DisplayCountto prefix="Filtered Journals: " :end-value="filteredRowCount" :duration="3000" />
			</div>
			<USeparator class="py-2" />
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="flex flex-wrap justify-end gap-2">
					<!-- <PButton text icon="pi pi-plus" label="Expand All" /> -->
					<PButton
						:disabled="!expandedRows||Object.keys(expandedRows).length===0"
						text
						icon="pi pi-minus"
						label="Collapse All"
						@click="collapseAll"
					/>
				</div>
			</div>
		</template>
		<PColumn
			expander
			style="width: 5rem"
			frozen
		/>
		<PColumn
			v-for="col of visibleColumns"
			:key="col.colId"
			:field="col.field"
			:header="col.header"
			:sortable="col.sortable"
			:data-type="col.dataType"
			:frozen="col.frozen"
			:sort-field="col.sortField"
			:show-filter-match-modes="col.showFilterMatchModes"
		>
			<!-- Body Templates -->
			<template
				v-if="col.dataType === 'date'"
				#body="{ data }"
			>
				<TableDateCol
					:input="
						getNestedValue<TJournalRecSchema, Date>(data, col.colId)
					"
				/>
			</template>
			<template
				v-else-if="col.dataType === 'boolean'"
				#body="{ data }"
			>
				<TableBoolCol
					:input="
						getNestedValue<TJournalRecSchema, boolean>(
							data,
							col.colId
						)
					"
				/>
			</template>
			<template v-else-if="col.colType === 'tranSources'" #body="{ data }">
				<TableSourceTypeCol :input="getNestedValue<TJournalRecSchema, SourceType>(data, col.colId)" />
			</template>

			<!-- Filter Templates -->
			<template
				v-if="(col.colType === 'text'||col.colType==='stringToUpper') && col.filterable"
				#filter="{ filterModel }"
			>
				<PInputText
					v-model="filterModel.value"
					type="text"
					placeholder="Search..."
				/>
			</template>

			<template
				v-else-if="col.dataType === 'numeric' && col.filterable"
				#filter="{ filterModel }"
			>
				<PInputNumber
					v-model="filterModel.value"
					:min="0"
					:use-grouping="false"
				/>
			</template>
			<template
				v-else-if="col.dataType === 'date' && col.filterable"
				#filter="{ filterModel }"
			>
				<PDatePicker
					v-model="filterModel.value"
					date-format="mm/dd/yy"
					placeholder="mm/dd/yyyy"
				/>
			</template>
			<template
				v-else-if="col.dataType === 'boolean' && col.filterable"
				#filter="{ filterModel }"
			>
				<label class="font-bold">{{ col.displayLabel }}</label>
				<PCheckbox
					v-model="filterModel.value"
					:indeterminate="filterModel.value === null"
					binary
				/>
			</template>
			<template
				v-else-if="col.colType === 'tranSources' && col.filterable"
				#filter="{ filterModel }"
			>
				<PMultiSelect v-model="filterModel.value" :options="tranSourceVals" placeholder="Any" />
			</template>
		</PColumn>
		<template #expansion="slotProps">
			<div class="p-4">
				<h5>Journal #{{ slotProps.data.tranNumber }} Line Items</h5>
				<LedgerSubJournalEntryTable :entries="slotProps.data.entries" />
			</div>
		</template>
	</PDataTable>
	<div class="flex flex-row justify-between px-4">
		<div>
			columnDefs:
			<pre>{{ columnDefs }}</pre>
		</div>
		<div>
			columnOptions:
			<pre>{{ columnOptions }}</pre>
		</div>
		<div>
			visibleColumns:
			<pre>{{ visibleColumns }}</pre>
		</div>
	</div>
</template>
