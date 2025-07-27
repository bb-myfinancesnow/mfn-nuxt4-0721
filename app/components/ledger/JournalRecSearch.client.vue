<script lang="ts" setup>
import { LedgerSubJournalEntryTable } from '#components';
import type { DataTablePageEvent } from 'primevue/datatable';

interface Props {
	jeRecs: TJournalRecSchema[];
	isLoading: boolean;
}

defineProps<Props>();

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

const { columnOptions, visibleColumns, defaultRows, resetVisibleColumns, updateVisCols } = usePrimeTable({ columnDefs });

resetVisibleColumns();

const expandedRows = ref({});

const collapseAll = () => {
	expandedRows.value = {};
};

const pageEmit = (event: DataTablePageEvent) => {
	console.log(`pageemit`, event);
	collapseAll();
};
</script>

<template>
	<PDataTable
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
		@page="pageEmit"
	>
		<template #empty>
			No data found.
		</template>
		<template #loading>
			Loading data. Please wait.
		</template>
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<TableColPickPrime
					:col-options="columnOptions"
					:visible-cols="visibleColumns"
					:loading="isLoading"
					:disabled="isLoading"
					@update-cols="(cols) => updateVisCols(cols as IPrimeColumnConfig<TJournalRecSchema>[])"
				/>
			</div>
		</template>
		<PColumn expander style="width: 5rem" frozen />
		<PColumn
			v-for="col of visibleColumns"
			:key="col.colId"
			:field="col.field"
			:header="col.header"
			:sortable="col.sortable"
			:data-type="col.dataType"
			:frozen="col.frozen"
			:sort-field="col.sortField"
		>
			<!-- Body Templates -->
			<template
				v-if="col.dataType === 'date'"
				#body="{ data }"
			>
				<TableDateCol
					:input="
						getNestedValue<TJournalRecSchema, Date>(
							data,
							col.colId
						)
					"
				/>
			</template>
			<template
				v-else-if="col.dataType === 'boolean'"
				#body="{ data }"
			>
				<TableBoolCol
					:input="
						getNestedValue<
											TJournalRecSchema,
											boolean
							>(data, col.colId)
					"
				/>
			</template>

			<!-- Filter Templates -->
			<template v-if="col.dataType ==='text' && col.filterable" #filter="{ filterModel }">
				<PInputText v-model="filterModel.value" type="text" placeholder="Search..." />
			</template>

			<template v-else-if="col.dataType ==='numeric' && col.filterable" #filter="{ filterModel }">
				<PInputNumber
					v-model="filterModel.value"
					:min="0"
					:use-grouping="false"
				/>
			</template>
			<template v-else-if="col.dataType ==='date' && col.filterable" #filter="{ filterModel }">
				<PDatePicker v-model="filterModel.value" date-format="mm/dd/yy" placeholder="mm/dd/yyyy" />
			</template>
			<template v-else-if="col.dataType ==='boolean' && col.filterable" #filter="{ filterModel }">
				<label class="font-bold">{{ col.displayLabel }}</label>
				<PCheckbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary />
			</template>
		</PColumn>
		<template #expansion="slotProps">
			<div class="p-4">
				<h5>Journal #{{ slotProps.data.tranNumber }} Line Items </h5>
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
