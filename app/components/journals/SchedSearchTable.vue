<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type {
	DataTableFilterEvent,
	DataTableFilterMeta
} from 'primevue/datatable';
import { SourceType } from '~/generated/graphql';

interface Props {
	schedRecs: TTranSchedRecordSchema[];
	isLoading: boolean;
}

const props = defineProps<Props>();

const tranSourceVals = Object.values(SourceType);

const columnDefs: IPrimeColumnDef<TTranSchedRecordSchema>[] = [
	{
		colId: 'id',
		colType: 'integer',
		filterable: true,
		field: 'id',
		sortable: true,
		frozen: true,
		header: 'ID',
		displayLabel: 'ID',
		disableHide: true
	},
	{
		colId: 'name',
		colType: 'text',
		field: 'name',
		filterable: true,
		header: 'Name',
		globalFilterable: true,
		displayLabel: 'Name'
	},
	{
		colId: 'startDate',
		filterable: true,
		field: 'startDate',
		sortable: true,
		header: 'Start Date',
		style: 'min-width: 200px',
		displayLabel: 'Start Date',
		disableHide: false,
		colType: 'date'
	},
	{
		colId: 'isActive',
		filterable: true,
		field: 'isActive',
		colType: 'boolean',
		header: 'Active',
		displayLabel: 'Active'
	},
	{
		colId: '_count.scheduleLogs',
		field: '_count.scheduleLogs',
		colType: 'integer',
		header: 'Log Count',
		displayLabel: 'Log Count',
		sortable: true,
		filterable: true
	}

];

const defaultFilters: DataTableFilterMeta = {
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	id: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }]
	},
	name: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
	},
	startDate: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }]
	},
	description: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
	},
	'_count.scheduleLogs': {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
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

const filteredRowCount = ref<number>(props.schedRecs.length);

const filterEmit = (event: DataTableFilterEvent) => {
	console.log(`filterEmit`, event);
	const l = event.filteredValue.length;
	console.log(`filtered length is ${l} with type ${typeof l}`);

	if (l && typeof l === 'number') filteredRowCount.value = l;
};

const goToSchedPage = async (templateId: number) => {
	console.log(`go to page ${templateId}`);
};
</script>

<template>
	<PDataTable
		v-model:filters="filters"
		:value="schedRecs"
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
								cols as IPrimeColumnConfig<TTranSchedRecordSchema>[]
							)
					"
				/>
			</div>
			<USeparator class="py-2" />
			<div class="flex items-center justify-between gap-2">
				<DisplayCountto prefix="Total Records: " :end-value="schedRecs.length" />
				<DisplayCountto prefix="Filtered Records: " :end-value="filteredRowCount" :duration="3000" />
			</div>
			<USeparator class="py-2" />
		</template>
		<PColumn column-key="view">
			<template #body="{ data }">
				<PButton
					icon="pi pi-eye"
					severity="secondary"
					raised
					@click="() => goToSchedPage(data.id)"
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
