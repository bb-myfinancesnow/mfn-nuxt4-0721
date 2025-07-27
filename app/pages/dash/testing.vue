<script lang="ts" setup>
import { PivotViewComponent as EjsPivotview, GroupingBar, FieldList, CalculatedField } from '@syncfusion/ej2-vue-pivotview';

import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
	// refresh: refreshJournalQuery
} = await ledgerData.searchGlEntryRecs({
	orderBy: [{ journal: { tranNumber: SortOrder.Asc } }, { id: SortOrder.Asc }]
});

const dataSourceSettings = {
	dataSource: [
		{ Amount: 5100, Country: 'Canada', Date: 'FY 2006', Product: 'Car', Quantity: 21, State: 'Alberta' },
		{ Amount: 1900, Country: 'France', Date: 'FY 2007', Product: 'Car', Quantity: 23, State: 'Alberta' },
		{ Amount: 1000, Country: 'Germany', Date: 'FY 2008', Product: 'Car', Quantity: 29, State: 'Alberta' },
		{ Amount: 2060, Country: 'Canada', Date: 'FY 2006', Product: 'Car', Quantity: 93, State: 'British Columbia' },
		{ Amount: 6200, Country: 'France', Date: 'FY 2007', Product: 'Car', Quantity: 36, State: 'British Columbia' },
		{ Amount: 2000, Country: 'Germany', Date: 'FY 2008', Product: 'Car', Quantity: 31, State: 'British Columbia' },
		{ Amount: 1300, Country: 'Canada', Date: 'FY 2005', Product: 'Car', Quantity: 45, State: 'Brunswick' },
		{ Amount: 3400, Country: 'France', Date: 'FY 2006', Product: 'Car', Quantity: 47, State: 'Brunswick' },
		{ Amount: 2300, Country: 'Germany', Date: 'FY 2007', Product: 'Car', Quantity: 43, State: 'Brunswick' }
	],
	rows: [{ name: 'Country' }],
	columns: [{ name: 'Date' }],
	values: [{ name: 'Amount' }, { name: 'Total', type: 'CalculatedField' }],
	formatSettings: [{ name: 'Amount', format: 'C1' }],
	calculatedFieldSettings: [{ name: 'Total', formula: '"Sum(Amount)"+"Sum(Quantity)"' }]
};
const showFieldList = true;
const showGroupingBar = true;
const allowCalculatedField = true;
const height = 350;
const width = '100%';

provide('pivotview', [GroupingBar, FieldList, CalculatedField]);
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
					<ejs-pivotview
						:height="height"
						:width="width"
						:data-source-settings="dataSourceSettings"
						:show-field-list="showFieldList"
						:show-grouping-bar="showGroupingBar"
						:allow-calculated-field="allowCalculatedField"
					/>
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
