<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type {
	DataTableFilterEvent,
	DataTableFilterMeta
} from 'primevue/datatable';
import { SourceType } from '~/generated/graphql';

interface Props {
	jeRecs: TJournalHeaderDetailSchema[];
	isLoading: boolean;
}

const props = defineProps<Props>();

const tranSourceVals = Object.values(SourceType);

const columnDefs: IPrimeColumnDef<TJournalHeaderDetailSchema>[] = [
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

const filteredRowCount = ref<number>(props.jeRecs.length);

const filterEmit = (event: DataTableFilterEvent) => {
	console.log(`filterEmit`, event);
	const l = event.filteredValue.length;
	console.log(`filtered length is ${l} with type ${typeof l}`);

	if (l && typeof l === 'number') filteredRowCount.value = l;
};

const goToJePage = async (journalId: string) => {
	console.log(`go to page ${journalId}`);

	// await navigateTo({
	// 	path: '/dash/journals/record/',
	// 	params: {
	// 		id: journalId
	// 	}
	// });
	await navigateTo(`/dash/journals/record/${journalId}`);
};
</script>

<template>
	<PDataTable
		v-model:filters="filters"
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
								cols as IPrimeColumnConfig<TJournalHeaderDetailSchema>[]
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
		</template>
		<PColumn column-key="view">
			<template #body="{ data }">
				<PButton
					icon="pi pi-eye"
					severity="secondary"
					raised
					@click="() => goToJePage(data.id)"
				/>
			</template>
		</PColumn>
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
	</PDataTable>
</template>
