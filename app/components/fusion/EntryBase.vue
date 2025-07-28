<script lang="ts" setup>
import { PivotViewComponent as EjsPivotview, type IDataSet } from '@syncfusion/ej2-vue-pivotview';
import type { DataSourceSettingsModel } from '@syncfusion/ej2-pivotview/src/model/datasourcesettings-model';

interface Props {
	entryData: TFlatJournalEntryLedgerRecSchema[];
	isLoading: boolean;
}

const props = defineProps<Props>();

const pivotDataVals = ref<IPivotJournalEntryData[]>([]);

const getPivotDataVals = (): IDataSet[] => {
	const res = formatEntryLedgerPivotData(props.entryData);
	pivotDataVals.value = res;
	return res;
};

const dataSourceSettings: DataSourceSettingsModel = {
	dataSource: getPivotDataVals(),
	expandAll: false,
	rows: [{ name: 'accountClass', caption: 'Class' }, { name: 'glAccountLabel', caption: 'Account' }],
	columns: [{ name: 'periodLabel', caption: 'Period' }],
	values: [{ name: 'entryAmount', caption: 'Amounts' }],
	formatSettings: [{ name: 'entryAmount', format: 'C0' }],
	filters: []
};
const showFieldList = true;
const showGroupingBar = true;
const allowCalculatedField = true;
const height = 1000;
const width = '100%';

const setPivotDataVals = () => {
	const res = formatEntryLedgerPivotData(props.entryData);
	pivotDataVals.value = res;
};

const refreshDataSource = () => {
	setPivotDataVals();
	pivotviewbase.value.refresh();
};

const pivotviewbase = ref();
</script>

<template>
	<div>
		<div class="flex-1">
			<UButton label="Refresh" @click="refreshDataSource" />
			<ejs-pivotview
				id="pivotviewbase"
				ref="pivotviewbase"
				:height="height"
				:width="width"
				:data-source-settings="dataSourceSettings"
				:show-field-list="showFieldList"
				:show-grouping-bar="showGroupingBar"
				:allow-calculated-field="allowCalculatedField"
			/>
		</div>

		<!-- <span>{{ dataSourceSettings.dataSource.length }}</span> -->
		<span>{{ entryData.length }}</span>
		<div class="flex justify-between">
			<div>
				entryData:
				<pre>{{ entryData }}</pre>
			</div>
			<div>
				dataSourceSettings:
				<pre>{{ dataSourceSettings }}</pre>
			</div>
			<!-- <div>
				dataSourceSettings:
				<pre>{{ pivotviewbase. }}</pre>
			</div> -->
		</div>
	</div>
</template>
