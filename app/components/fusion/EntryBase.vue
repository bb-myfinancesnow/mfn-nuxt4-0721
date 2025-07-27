<script lang="ts" setup>
interface Props {
	entryData: TFlatJournalEntryLedgerRecSchema[];
	isLoading: boolean;
}

defineProps<Props>();

const dataSourceSettings = {
	dataSource: [
		{
			Amount: 5100,
			Country: 'Canada',
			Date: 'FY 2006',
			Product: 'Car',
			Quantity: 21,
			State: 'Alberta'
		},
		{
			Amount: 1900,
			Country: 'France',
			Date: 'FY 2007',
			Product: 'Car',
			Quantity: 23,
			State: 'Alberta'
		},
		{
			Amount: 1000,
			Country: 'Germany',
			Date: 'FY 2008',
			Product: 'Car',
			Quantity: 29,
			State: 'Alberta'
		},
		{
			Amount: 2060,
			Country: 'Canada',
			Date: 'FY 2006',
			Product: 'Car',
			Quantity: 93,
			State: 'British Columbia'
		},
		{
			Amount: 6200,
			Country: 'France',
			Date: 'FY 2007',
			Product: 'Car',
			Quantity: 36,
			State: 'British Columbia'
		},
		{
			Amount: 2000,
			Country: 'Germany',
			Date: 'FY 2008',
			Product: 'Car',
			Quantity: 31,
			State: 'British Columbia'
		},
		{
			Amount: 1300,
			Country: 'Canada',
			Date: 'FY 2005',
			Product: 'Car',
			Quantity: 45,
			State: 'Brunswick'
		},
		{
			Amount: 3400,
			Country: 'France',
			Date: 'FY 2006',
			Product: 'Car',
			Quantity: 47,
			State: 'Brunswick'
		},
		{
			Amount: 2300,
			Country: 'Germany',
			Date: 'FY 2007',
			Product: 'Car',
			Quantity: 43,
			State: 'Brunswick'
		}
	],
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
