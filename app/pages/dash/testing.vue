<script lang="ts" setup>
import type { ColumnProps } from 'primevue/column';
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const { data: jeData, pending, refresh: refreshJournalQuery } = await ledgerData.searchJournalFormattedRecs({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});

interface PrimeColumnProps extends ColumnProps {
	colId: string;
}

const columns: PrimeColumnProps[] = [
	{
		colId: 'tranNumber',
		field: 'tranNumber',
		dataType: 'numeric',
		sortable: true,
		frozen: true,
		header: '#'
	},
	{
		colId: 'tranDate',
		field: 'tranDate',
		dataType: 'date',
		sortable: true,
		header: 'Tran Date',
		style: 'min-width: 200px'
	},
	{
		colId: 'description',
		field: 'description',
		dataType: 'text',
		header: 'Description'
	},
	{
		colId: 'id',
		field: 'id',
		dataType: 'text',
		sortable: true,
		header: 'ID'
	},

	{
		colId: 'postingPeriod.label',
		field: 'postingPeriod.label',
		dataType: 'text',
		sortField: 'postingPeriod.id',
		header: 'Period',
		sortable: true
	},
	{
		colId: 'postingPeriod.locked',
		field: 'postingPeriod.locked',
		dataType: 'boolean',
		header: 'Locked'
	}
];
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
									@click="refreshJournalQuery()"
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
							<template
								v-if="col.dataType === 'date'"
								#body="{ data }"
							>
								<!-- {{ formatUSDate(data[col.colId]) }} -->
								{{ formatUSDate(getNestedValue<TJournalRecSchema, Date>(data, col.colId)??new Date()) }}
							</template>
							<template v-else-if="col.dataType==='boolean'" #body="{ data }">
								<!-- {{ getNestedValue<TJournalRecSchema, boolean>(data, col.colId) }} -->
								<!-- <i
									class="pi"
									:class="{
										'pi-check-circle text-green-500 ': getNestedValue<TJournalRecSchema, boolean>(data, col.colId),
										'pi-times-circle text-red-500': !getNestedValue<TJournalRecSchema, boolean>(data, col.colId)
									}"
								/> -->
								<TableBoolCol :input="getNestedValue<TJournalRecSchema, boolean>(data, col.colId)" />
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
