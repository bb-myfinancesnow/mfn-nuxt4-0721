<script lang="ts" setup>
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent } from 'primevue/datatable';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending,
	refresh: refreshJournalQuery
} = await ledgerData.searchJournalFormattedRecs({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});

// const columns: IPrimeColumnProps[] = [
// 	{
// 		colId: 'tranNumber',
// 		filterable: true,
// 		field: 'tranNumber',
// 		dataType: 'numeric',
// 		sortable: true,
// 		frozen: true,
// 		header: '#',
// 		displayLabel: '#',
// 		disableHide: true
// 	},
// 	{
// 		colId: 'tranDate',
// 		filterable: true,
// 		field: 'tranDate',
// 		dataType: 'date',
// 		sortable: true,
// 		header: 'Tran Date',
// 		style: 'min-width: 200px',
// 		displayLabel: 'Tran Date',
// 		disableHide: true
// 	},

// 	{
// 		colId: 'postingPeriod.label',
// 		field: 'postingPeriod.label',
// 		filterable: false,
// 		dataType: 'text',
// 		sortField: 'postingPeriod.id',
// 		header: 'Period',
// 		sortable: true,
// 		displayLabel: 'Period'
// 	},
// 	{
// 		colId: 'description',
// 		filterable: true,
// 		field: 'description',
// 		dataType: 'text',
// 		header: 'Description',
// 		displayLabel: 'Description'
// 	},
// 	{
// 		colId: 'postingPeriod.locked',
// 		filterable: false,
// 		field: 'postingPeriod.locked',
// 		dataType: 'boolean',
// 		header: 'Locked',
// 		displayLabel: 'Period Locked'
// 	},
// 	{
// 		colId: 'id',
// 		filterable: true,
// 		field: 'id',
// 		dataType: 'text',
// 		sortable: true,
// 		header: 'ID',
// 		displayLabel: 'ID',
// 		defaultHidden: true
// 	}
// ];

const columnOptions = ref<IPrimeColumnProps[]>([
	{
		colId: 'tranNumber',
		filterable: true,
		field: 'tranNumber',
		dataType: 'numeric',
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
		dataType: 'date',
		sortable: true,
		header: 'Tran Date',
		style: 'min-width: 200px',
		displayLabel: 'Tran Date',
		disableHide: true
	},

	{
		colId: 'postingPeriod.label',
		field: 'postingPeriod.label',
		filterable: false,
		dataType: 'text',
		sortField: 'postingPeriod.id',
		header: 'Period',
		sortable: true,
		displayLabel: 'Period'
	},
	{
		colId: 'description',
		filterable: true,
		field: 'description',
		dataType: 'text',
		header: 'Description',
		displayLabel: 'Description'
	},
	{
		colId: 'postingPeriod.locked',
		filterable: false,
		field: 'postingPeriod.locked',
		dataType: 'boolean',
		header: 'Locked',
		displayLabel: 'Period Locked'
	},
	{
		colId: '_count.entries',
		field: '_count.entries',
		dataType: 'numeric',
		header: 'Entry Count',
		displayLabel: 'Entry Count',
		sortable: true,
		filterable: true
	},
	{
		colId: 'id',
		filterable: true,
		field: 'id',
		dataType: 'text',
		sortable: true,
		header: 'ID',
		displayLabel: 'ID',
		defaultHidden: true
	}
]);
const visibleColumns = ref<IPrimeColumnProps[]>([]);

const filters = ref();
const expandedRows = ref({});

const filteredRowCount = ref<number>(jeData.value.length);

const resetVisibleColumns = () => {
	const cols = columnOptions.value.filter((col) => !col.defaultHidden);
	visibleColumns.value = cols;
};

const initFilters = () => {
	const defaultFilters: DataTableFilterMeta = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		tranNumber: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
		},
		tranDate: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }]
		},
		description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		'_count.entries': {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
		}
	};
	filters.value = defaultFilters;
};

resetVisibleColumns();
initFilters();

const clearFilter = () => {
	initFilters();
};

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

const updateVisCols = (cols: IPrimeColumnProps[]) => {
	visibleColumns.value = cols;
};

const getEntryValSum = (id: string): string => {
	const je = jeData.value.find((j) => j.id === id);

	if (je) {
		const { entries } = je;
		const formattedEntries = entries.map(({ amount, isDebit }) => isDebit ? amount : -1 * amount);

		const summed = sumArray(formattedEntries);

		return formatIntAccountingCurrency(summed);
	} else {
		return formatIntAccountingCurrency(0);
	}
};
</script>

<template>
	<UDashboardPanel id="testingpage">
		<template #header>
			<UDashboardNavbar
				title="Testing Page"
				:ui="{ right: 'gap-3' }"
			>
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UColorModeSelect />
				</template>
			</UDashboardNavbar>
		</template>
		<template #body>
			<div>
				<ClientOnly>
					<PDataTable
						v-model:filters="filters"
						v-model:expanded-rows="expandedRows"
						:value="jeData"
						data-key="id"
						:loading="pending"
						table-style="min-width: 150rem"
						scrollable
						scroll-height="flex"
						resizable-columns
						removable-sort
						paginator
						sort-mode="multiple"
						:rows="10"
						:rows-per-page-options="[5, 10, 25, 50, 100]"
						filter-display="menu"
						:global-filter-fields="['id', 'description', 'tranNumber']"
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
							<div
								class="flex flex-wrap items-center justify-between gap-2"
							>
								<span class="text-xl font-bold">Search Journals</span>
								<!-- <DisplayCountto prefix="Total Journals: " :end-value="jeData.length" /> -->
								<PButton
									icon="pi pi-refresh"
									rounded
									raised
									@click="refreshJournalQuery()"
								/>
							</div>
							<USeparator class="py-2" />
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
								<TablePrimeColPicklist
									:col-options="columnOptions"
									:visible-cols="visibleColumns"
									:loading="pending"
									:disabled="pending"
									@update-cols="updateVisCols"
								/>
								<div class="flex flex-wrap justify-end gap-2">
									<!-- <PButton text icon="pi pi-plus" label="Expand All" /> -->
									<PButton
										text
										icon="pi pi-minus"
										label="Collapse All"
										@click="collapseAll"
									/>
								</div>
							</div>
							<USeparator class="py-2" />
							<div class="flex items-center justify-between gap-2">
								<DisplayCountto prefix="Total Journals: " :end-value="jeData.length" />
								<DisplayCountto prefix="Filtered Journals: " :end-value="filteredRowCount" :duration="3000" />
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
								<!-- {{ formatUSDate(data[col.colId]) }} -->
								<!-- <div>
									{{ formatUSDate(getNestedValue<TJournalRecSchema, Date>(data, col.colId)??new Date()) }}
								</div> -->
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
								<!-- {{ getNestedValue<TJournalRecSchema, boolean>(data, col.colId) }} -->
								<!-- <i
									class="pi"
									:class="{
										'pi-check-circle text-green-500 ': getNestedValue<TJournalRecSchema, boolean>(data, col.colId),
										'pi-times-circle text-red-500': !getNestedValue<TJournalRecSchema, boolean>(data, col.colId)
									}"
								/> -->
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
						</PColumn>
						<template #expansion="slotProps">
							<div class="p-4">
								<h5>Journal #{{ slotProps.data.tranNumber }} Line Items </h5>
								<PDataTable
									:value="slotProps.data.entries"
									scrollable
									scroll-height="flex"
									resizable-columns
								>
									<PColumn
										field="id"
										header="ID"
										data-type="numeric"
										style="width: 5rem"
										frozen
									/>
									<PColumn
										field="glAccount.accountLabel"
										header="GL Account"
										data-type="text"
										style="width: 15rem"
										frozen
									/>
									<PColumn
										field="amount"
										header="Amount"
										data-type="numeric"
										style="width: 10%; min-width: 8rem; text-align:center"
										body-style="text-align:center"
										frozen
									>
										<template #body="{ data }">
											<TableCurrencyCol
												:input="data.amount"
												:negative-multi="!data.isDebit"
											/>
										</template>
										<template #footer>
											<span class="font-bold">Total: {{ getEntryValSum(slotProps.data.id) }}</span>
										</template>
									</PColumn>
									<PColumn
										field="isDebit"
										header="Debit"
										data-type="boolean"
										style="width: 5rem; text-align:center"
									>
										<template #body="{ data }">
											<TableBoolCol :input="data.isDebit" />
										</template>
									</PColumn>
									<PColumn
										field="memo"
										header="Memo"
										data-type="text"
										style="min-width: 200px"
									/>
								</PDataTable>
							</div>
						</template>
					</PDataTable>
				</ClientOnly>
			</div>
			<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
				<div>
					columnOptions:
					<pre>{{ columnOptions }}</pre>
				</div>
				<div>
					visibleColumns:
					<pre>{{ visibleColumns }}</pre>
				</div>

				<div>status: {{ String(pending) }}</div>
				<div>
					expandedRows:
					<pre>{{ expandedRows }}</pre>
				</div>
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
