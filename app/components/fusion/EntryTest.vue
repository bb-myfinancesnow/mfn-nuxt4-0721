<script lang="ts" setup>
// import { PivotViewComponent as EjsPivotview, GroupingBar, FieldList, CalculatedField } from '@syncfusion/ej2-vue-pivotview';
import { pivotData } from '~/example-data/pivot-example';

interface Props {
	entryData: TFlatJournalEntryLedgerRecSchema[];
	isLoading: boolean;
}

defineProps<Props>();

const dataSourceSettings = {
	dataSource: pivotData,
	expandAll: false,
	drilledMembers: [{ name: 'Country', items: ['France'] }],
	columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
	values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
	rows: [{ name: 'Country' }, { name: 'Products' }],
	formatSettings: [{ name: 'Amount', format: 'C0' }],
	filters: []
};
const showFieldList = true;
const showGroupingBar = true;
const allowCalculatedField = true;
const height = 1000;
const width = '100%';

// provide('pivotview', [GroupingBar, FieldList, CalculatedField]);
</script>

<template>
	<div>
		<ejs-pivotview
			:height="height"
			:width="width"
			:data-source-settings="dataSourceSettings"
			:show-field-list="showFieldList"
			:show-grouping-bar="showGroupingBar"
			:allow-calculated-field="allowCalculatedField"
		/>
		<!-- <div class="flex justify-between">
			<div>
				entryData:
				<pre>{{ entryData }}</pre>
			</div>
			<div>
				entryData:
				<pre>{{ dataSourceSettings.dataSource }}</pre>
			</div>
		</div> -->
	</div>
</template>
