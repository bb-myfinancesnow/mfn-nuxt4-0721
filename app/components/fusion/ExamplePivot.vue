<script lang="ts" setup>
import type { ITestPivotCountryState } from '~/example-data/pivot-example';

interface Props {
	entryData: TFlatJournalEntryLedgerRecSchema[];
	isLoading: boolean;
	countryStateExample: ITestPivotCountryState[];
}

const props = defineProps<Props>();

// const testPivotData = ref<ITestPivotCountryState[]>(testPivotDataCountryState);

const dataSourceSettings = {
	dataSource: props.countryStateExample,
	rows: [{ name: 'Country' }],
	columns: [{ name: 'Date' }],
	values: [{ name: 'Amount' }, { name: 'Total', type: 'CalculatedField' }],
	formatSettings: [{ name: 'Amount', format: 'C1' }],
	calculatedFieldSettings: [
		{ name: 'Total', formula: '"Sum(Amount)"+"Sum(Quantity)"' }
	]
};
const showFieldList = true;
const showGroupingBar = true;
const allowCalculatedField = true;
const height = 1000;
const width = '100%';
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
