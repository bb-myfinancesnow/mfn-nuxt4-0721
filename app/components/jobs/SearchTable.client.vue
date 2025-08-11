<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type {
	DataTableFilterEvent,
	DataTableFilterMeta
} from 'primevue/datatable';

interface Props {
	jobRecs: TFullBulkJobSubmissionSchema[];
	isLoading: boolean;
}

const props = defineProps<Props>();

const columnDefs: IPrimeColumnDef<TFullBulkJobSubmissionSchema>[] = [
	{
		colId: 'id',
		filterable: true,
		field: 'id',
		colType: 'text',
		sortable: true,
		header: 'ID',
		displayLabel: 'ID',
		defaultHidden: false,
		globalFilterable: true,
		style: 'width: 100px'
	},
	{
		colId: 'status',
		filterable: true,
		field: 'status',
		colType: 'jobStatuses',
		sortable: true,
		header: 'Status',
		displayLabel: 'Status',
		globalFilterable: false,
		style: 'width: 100px'
	},
	{
		colId: 'startedAt',
		filterable: false,
		field: 'startedAt',
		sortable: true,
		header: 'Started',
		displayLabel: 'Started',
		colType: 'date',
		style: 'width: 100px'
	},
	{
		colId: 'finishedAt',
		filterable: false,
		field: 'finishedAt',
		sortable: true,
		header: 'Finished',
		displayLabel: 'Finished',
		colType: 'date',
		style: 'width: 80px'
	},
	{
		colId: 'recordTotal',
		filterable: true,
		field: 'recordTotal',
		sortable: true,
		header: 'Record Total',
		displayLabel: 'Record Total',
		colType: 'numeric',
		style: 'width: 80px'
	},
	{
		colId: 'successCount',
		filterable: true,
		field: 'successCount',
		sortable: true,
		header: 'Success',
		displayLabel: 'Success',
		colType: 'numeric',
		style: 'width: 80px'
	},
	{
		colId: 'errorCount',
		filterable: true,
		field: 'errorCount',
		sortable: true,
		header: 'Errors',
		displayLabel: 'Errors',
		colType: 'numeric',
		style: 'width: 80px'
	},
	{
		colId: 'createdAt',
		filterable: false,
		field: 'createdAt',
		sortable: true,
		header: 'Created',
		displayLabel: 'Created',
		colType: 'datetime',
		defaultHidden: false,
		style: 'min-width: 80px; max-width: 100px'
	},
	{
		colId: 'updatedAt',
		filterable: false,
		field: 'updatedAt',
		sortable: true,
		header: 'Updated',
		displayLabel: 'Updated',
		colType: 'datetime',
		defaultHidden: true,
		style: 'max-width: 100px'
	}

];

const defaultFilters: DataTableFilterMeta = {
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	id: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
	},
	status: { value: null, matchMode: FilterMatchMode.IN },
	recordTotal: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	successCount: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	},
	errorCount: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
	}
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

const filteredRowCount = ref<number>(props.jobRecs.length);

const filterEmit = (event: DataTableFilterEvent) => {
	console.log(`filterEmit`, event);
	const l = event.filteredValue.length;
	console.log(`filtered length is ${l} with type ${typeof l}`);

	if (l && typeof l === 'number') filteredRowCount.value = l;
};
</script>

<template>
	<div class="w-full">
		<PDataTable
			v-model:filters="filters"
			:value="jobRecs"
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
									cols as IPrimeColumnConfig<TFullBulkJobSubmissionSchema>[]
								)
						"
					/>
				</div>
				<USeparator class="py-2" />
				<div class="flex items-center justify-between gap-2">
					<DisplayCountto prefix="Total Journals: " :end-value="jobRecs.length" />
					<DisplayCountto prefix="Filtered Journals: " :end-value="filteredRowCount" :duration="3000" />
				</div>
				<USeparator class="py-2" />
			</template>
			<!-- <PColumn column-key="view">
			<template #body="{ data }">
				<PButton
					icon="pi pi-eye"
					severity="secondary"
					raised
					@click="() => goToJePage(data.id)"
				/>
			</template>
		</PColumn> -->
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
				:style="col.style"
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
				<!-- <template v-else-if="col.colType === 'tranSources'" #body="{ data }">
				<TableSourceTypeCol :input="getNestedValue<TJournalRecSchema, SourceType>(data, col.colId)" />
			</template> -->

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
				<template
					v-else-if="col.colType === 'jobStatuses' && col.filterable"
					#filter="{ filterModel }"
				>
					<PMultiSelect v-model="filterModel.value" :options="jobStatusVals" placeholder="Any" />
				</template>
			</PColumn>
		</PDataTable>
	</div>
</template>
