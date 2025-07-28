<script lang="ts" setup>
import type { ColumnModel, FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-grids';
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
	// refresh: refreshJournalQuery
} = await ledgerData.searchGlEntryRecs({
	orderBy: [{ journal: { tranNumber: SortOrder.Asc } }, { id: SortOrder.Asc }]
});

interface ISyncColModel extends ColumnModel {
	colId: string;
}

const gridCols = ref<ISyncColModel[]>([
	{
		colId: 'id',
		field: 'id',
		headerText: 'ID',
		allowSorting: true,
		type: 'number',
		autoFit: true
	},
	{
		colId: 'journalNumber',
		field: 'journalNumber',
		headerText: 'JE#',
		allowSorting: true,
		type: 'number'
	},
	{
		colId: 'postingDate',
		field: 'postingDate',
		headerText: 'Posting Date',
		type: 'date',
		format: {
			type: 'date',
			format: 'MM/dd/yyyy'
		}
	}
]);

const pageSettings = ref<PageSettingsModel>({
	pageSizes: [5, 10, 25, 50, 100],
	pageSize: 10
});

const filterSettings = ref<FilterSettingsModel>({
	type: 'Menu'
});
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
			<ClientOnly>
				<!-- <FusionEntryBase :is-loading="pending" :entry-data="jeData" /> -->
				<ejs-grid
					:data-source="jeData"
					:allow-sorting="true"
					:allow-paging="true"
					:allow-filtering="true"
					:page-settings="pageSettings"
					:filter-settings="filterSettings"
				>
					<e-columns>
						<e-column
							v-for="col in gridCols"
							:key="col.colId"
							:field="col.field"
							:header-text="col.headerText"
							:allow-sorting="col.allowSorting"
							:type="col.type"
							:format="col.format"
							:auto-fit="col.autoFit"
						/>
					</e-columns>
				</ejs-grid>
			</ClientOnly>
			<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
				<div>status: {{ String(pending) }}</div>
				<div>
					gridCols:
					<pre>{{ gridCols }}</pre>
				</div>
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
