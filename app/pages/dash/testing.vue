<script lang="ts" setup>
import type { DataTableFilterMeta } from 'primevue/datatable';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { ColumnProps } from 'primevue/column';
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending,
	refresh: refreshJournalQuery
} = await ledgerData.searchJournalFormattedRecs({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});

interface PrimeColumnProps extends ColumnProps {
	colId: string;
	filterable: boolean;
}

const columns: PrimeColumnProps[] = [
	{
		colId: 'tranNumber',
		filterable: true,
		field: 'tranNumber',
		dataType: 'numeric',
		sortable: true,
		frozen: true,
		header: '#'

	},
	{
		colId: 'tranDate',
		filterable: true,
		field: 'tranDate',
		dataType: 'date',
		sortable: true,
		header: 'Tran Date',
		style: 'min-width: 200px'
	},

	{
		colId: 'postingPeriod.label',
		field: 'postingPeriod.label',
		filterable: false,
		dataType: 'text',
		sortField: 'postingPeriod.id',
		header: 'Period',
		sortable: true
	},
	{
		colId: 'description',
		filterable: true,
		field: 'description',
		dataType: 'text',
		header: 'Description'
	},
	{
		colId: 'postingPeriod.locked',
		filterable: false,
		field: 'postingPeriod.locked',
		dataType: 'boolean',
		header: 'Locked'
	},
	{
		colId: 'id',
		filterable: true,
		field: 'id',
		dataType: 'text',
		sortable: true,
		header: 'ID'
	}
];

const filters = ref();

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
		description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
	};
	filters.value = defaultFilters;
};

initFilters();

const clearFilter = () => {
	initFilters();
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
						:value="jeData"
						data-key="id"
						:loading="pending"
						table-style="min-width: 150rem"
						scrollable
						scroll-height="flex"
						resizable-columns
						removable-sort
						paginator
						:rows="10"
						:rows-per-page-options="[5, 10, 25, 50, 100]"
						filter-display="menu"
						:global-filter-fields="['id', 'description', 'tranNumber']"
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
								<DisplayCountto prefix="Total Journals: " :end-value="jeData.length" />
								<PButton
									icon="pi pi-refresh"
									rounded
									raised
									@click="refreshJournalQuery()"
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
							v-for="col of columns"
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
						</PColumn>
					</PDataTable>
				</ClientOnly>
			</div>
			<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
				<div>status: {{ String(pending) }}</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
