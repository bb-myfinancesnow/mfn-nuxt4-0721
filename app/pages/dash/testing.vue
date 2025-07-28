<script lang="ts" setup>
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
// 	dataSource: jeData.value,
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
				<FusionEntryBase :is-loading="pending" :entry-data="jeData" />
			</ClientOnly>
			<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
				<div>status: {{ String(pending) }}</div>

				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
