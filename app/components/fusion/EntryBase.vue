<script lang="ts" setup>
import {
	PivotViewComponent as EjsPivotview,
	type IDataSet,
	type LoadEventArgs,
	type ToolbarItems
} from '@syncfusion/ej2-vue-pivotview';
import type {
	DataSourceSettingsModel,
	FieldOptionsModel
} from '@syncfusion/ej2-pivotview/src/model/datasourcesettings-model';

interface Props {
	entryData: TFlatJournalEntryLedgerRecSchema[];
	isLoading: boolean;
}

const periodSortOptions = computed(() => {
	const pers = props.entryData.map(({ periodId, periodLabel }) => ({
		periodId,
		periodLabel
	}));

	const sorted = pers
		.sort((a, b) => a.periodId - b.periodId)
		.map(({ periodLabel }) => periodLabel);
	const deDupe = deDupStringArray(sorted);
	return deDupe;
});
const props = defineProps<Props>();

const pivotDataVals = ref<IPivotJournalEntryData[]>([]);

const pivotFieldMapping: FieldOptionsModel[] = [
	{
		name: 'glAccountType',
		caption: 'Account Type',
		dataType: 'string'
	},
	{
		name: 'glAccountTypeSortOrder',
		caption: 'Account Type Order',
		dataType: 'number'
	},
	{
		name: 'postingDate',
		caption: 'Posting Date',
		showSortIcon: false
	}
];

const getPivotDataVals = (): IDataSet[] => {
	const res = formatEntryLedgerPivotData(props.entryData);
	pivotDataVals.value = res;
	return res;
};

const dataSourceSettings = ref<DataSourceSettingsModel>({
	dataSource: getPivotDataVals(),
	expandAll: false,
	enableSorting: true,
	sortSettings: [
		{
			name: 'accountClass',
			order: 'Ascending',
			membersOrder: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
		},
		{
			name: 'periodLabel',
			order: 'Ascending',
			membersOrder: periodSortOptions.value
		}
	],
	rows: [
		{ name: 'accountClass', caption: 'Class' },
		{ name: 'glAccountLabel', caption: 'Account' }
	],
	columns: [{ name: 'periodLabel', caption: 'Period' }],
	values: [{ name: 'entryAmount', caption: 'Amounts' }],
	formatSettings: [
		{ name: 'entryAmount', format: 'C2' },
		{ name: 'postingDate', type: 'date', format: 'MM/dd/yyyy' }
	],
	fieldMapping: pivotFieldMapping,
	filters: []
});
const showFieldList = true;
const showGroupingBar = true;
const allowCalculatedField = true;
const height = ref(1000);
const width = ref('100%');

const allowExcelExport = true;
const allowPdfExport = true;
const showToolbar = true;
const toolbar: ToolbarItems[] = [
	'Export',
	'SubTotal',
	'GrandTotal',
	'ConditionalFormatting',
	'NumberFormatting',
	'FieldList'
];
const allowConditionalFormatting = true;
const allowNumberFormatting = true;
// const showToolbar
const setPivotDataVals = () => {
	const res = formatEntryLedgerPivotData(props.entryData);
	pivotDataVals.value = res;
};

const refreshDataSource = () => {
	setPivotDataVals();
	// pivotviewbase.value.refresh();
};

const pivotviewbase = useTemplateRef<EjsPivotview>('pivotviewbase');

const onDataBound = () => {
	console.log('data bound');
	// const pivotObj = document.getElementById('pivotviewbase').ej2_instances[0];
	const pivotObj = pivotviewbase.value?.ej2Instances;

	if (pivotObj) {
		console.log('has obj');
	}
};

const load = (args: LoadEventArgs) => {
	const dsSetting: DataSourceSettingsModel = {
		dataSource: getPivotDataVals(),
		expandAll: false,
		enableSorting: true,
		sortSettings: [
			{
				name: 'accountClass',
				order: 'Ascending',
				membersOrder: [
					'Asset',
					'Liability',
					'Equity',
					'Revenue',
					'Expense'
				]
			},
			{
				name: 'periodLabel',
				order: 'Ascending',
				membersOrder: periodSortOptions.value
			}
		],
		rows: [
			{ name: 'accountClass', caption: 'Class' },
			{ name: 'glAccountLabel', caption: 'Account' }
		],
		columns: [{ name: 'periodLabel', caption: 'Period' }],
		values: [{ name: 'entryAmount', caption: 'Amounts' }],
		formatSettings: [
			{ name: 'entryAmount', format: 'C2' },
			{ name: 'postingDate', type: 'date', format: 'MM/dd/yyyy' }
		],
		fieldMapping: pivotFieldMapping,
		filters: []
	};

	dataSourceSettings.value = dsSetting;

	args.dataSourceSettings = dsSetting;
};
</script>

<template>
	<div>
		<div class="flex-1">
			<UButton
				label="Refresh"
				@click="refreshDataSource"
			/>
			<EjsPivotview
				id="pivotviewbase"
				ref="pivotviewbase"
				:height="height"
				:width="width"
				:data-source-settings="dataSourceSettings"
				:show-field-list="showFieldList"
				:show-grouping-bar="showGroupingBar"
				:allow-calculated-field="allowCalculatedField"
				:allow-excel-export="allowExcelExport"
				:allow-pdf-export="allowPdfExport"
				:allow-number-formatting="allowNumberFormatting"
				:allow-conditional-formatting="allowConditionalFormatting"
				:show-toolbar="showToolbar"
				:toolbar="toolbar"
				:data-bound="onDataBound"
				:load="load"
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
			<div>
				periodSortOptions:
				<pre>{{ periodSortOptions }}</pre>
			</div>
		</div>
	</div>
</template>
