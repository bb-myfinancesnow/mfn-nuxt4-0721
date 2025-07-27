<script lang="ts" setup>
import { testPivotDataCountryState } from '~/example-data/pivot-example';

import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
	// refresh: refreshJournalQuery
} = await ledgerData.searchGlEntryRecs({
	orderBy: [{ journal: { tranNumber: SortOrder.Asc } }, { id: SortOrder.Asc }]
});

// const dataSourceSettings = {
// 	dataSource: pivotData,
// 	expandAll: false,
// 	drilledMembers: [{ name: 'Country', items: ['France'] }],
// 	columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
// 	values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
// 	rows: [{ name: 'Country' }, { name: 'Products' }],
// 	formatSettings: [{ name: 'Amount', format: 'C0' }],
// 	filters: []
// };
// const showFieldList = true;
// const showGroupingBar = true;
// const allowCalculatedField = true;
// const height = 1000;
// const width = '100%';

// provide('pivotview', [GroupingBar, FieldList, CalculatedField]);
</script>

<template>
	<UDashboardPanel id="samplepage2">
		<template #header>
			<UDashboardNavbar
				title="Sample Page 2"
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
			<!-- <div>
				<ClientOnly>
					<ejs-grid :data-source="jeData" height="300px">
						<e-columns>
							<e-column field="id" header-text="ID" width="100" />
							<e-column field="description" header-text="Description" width="200" />
						</e-columns>
					</ejs-grid>
				</ClientOnly>
			</div> -->
			<div>
				<ClientOnly>
					<FusionExamplePivot :is-loading="pending" :entry-data="jeData" :country-state-example="testPivotDataCountryState" />
				</ClientOnly>
			</div>
			<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
				<!-- <div>
					columnOptions:
					<pre>{{ columnOptions }}</pre>
				</div> -->
				<!-- <div>
					visibleColumns:
					<pre>{{ visibleColumns }}</pre>
				</div> -->

				<div>status: {{ String(pending) }}</div>
				<!-- <div>
					expandedRows:
					<pre>{{ expandedRows }}</pre>
				</div> -->
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
