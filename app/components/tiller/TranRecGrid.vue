<script lang="ts" setup>
import type {
	FilterSettingsModel,
	PageSettingsModel
} from '@syncfusion/ej2-grids';
import type { GridComponent } from '@syncfusion/ej2-vue-grids';
import type { ClickEventArgs } from '@syncfusion/ej2-vue-navigations';

defineProps<{
	tranRecords: TTillerTranRecordSchema[];
	isLoading: boolean;
}>();

const toolbarOptions = ['ExcelExport', 'CsvExport', 'ColumnChooser'];

const grid = useTemplateRef<GridComponent>('grid');

const gridCols = ref<ISyncFusionGridColModel[]>([
	{
		colId: 'id',
		field: 'id',
		headerText: 'ID',
		allowSorting: true,
		type: 'number',
		autoFit: true,
		showInColumnChooser: false
	},
	{
		colId: 'date',
		field: 'date',
		headerText: 'Date',
		autoFit: true,
		type: 'date',
		format: {
			type: 'date',
			format: 'MM/dd/yyyy'
		}
	},
	{
		colId: 'dateAdded',
		field: 'dateAdded',
		headerText: 'Date Added',
		autoFit: true,
		type: 'date',
		format: {
			type: 'date',
			format: 'MM/dd/yyyy'
		}
	},

	{
		colId: 'account',
		field: 'account',
		headerText: 'Account',
		allowSorting: true,
		type: 'text',
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'category',
		field: 'category',
		headerText: 'Category',
		allowSorting: true,
		type: 'text',
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'decimalAmount',
		field: 'decimalAmount',
		headerText: 'Tiller Amount',
		type: 'number',
		autoFit: true,
		format: {
			format: 'C2'
		},
		textAlign: 'Right'
	},
	{
		colId: 'description',
		field: 'description',
		headerText: 'Description',
		allowSorting: false
	},
	{
		colId: 'generatedJournalNumber',
		field: 'generatedJournalNumber',
		headerText: 'Generated #',
		autoFit: true,
		type: 'number',
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'reconciled',
		field: 'reconciled',
		autoFit: true,
		headerText: 'Reconciled',
		type: 'boolean',
		displayAsCheckBox: true,
		allowSorting: false,
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'excluded',
		field: 'excluded',
		autoFit: true,
		headerText: 'Excluded',
		type: 'boolean',
		displayAsCheckBox: true,
		allowSorting: false,
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'createdAt',
		field: 'createdAt',
		visible: false,
		headerText: 'Created',
		autoFit: true,
		type: 'dateTime',
		format: {
			type: 'dateTime',
			format: 'MM/dd/yyyy h:mm:ss aaa'
		}
	},
	{
		colId: 'updatedAt',
		field: 'updatedAt',
		visible: false,
		headerText: 'Updated',
		autoFit: true,
		type: 'dateTime',
		format: {
			type: 'dateTime',
			format: 'MM/dd/yyyy h:mm:ss aaa'
		}
	}

]);

const pageSettings = ref<PageSettingsModel>({
	pageSizes: [5, 10, 25, 50, 100],
	pageSize: 25
});

const filterSettings = ref<FilterSettingsModel>({
	type: 'Excel'
});

const height = ref(600);

const toolbarClick = (args: ClickEventArgs) => {
	console.log(`toolbarclick ${args.item.id}`);
	switch (args.item.id) {
		case 'DefaultExport_excelexport':
			console.log('excel export');
			grid.value?.excelExport();
			break;
		case 'DefaultExport_csvexport':
			console.log('csv export');
			grid.value?.csvExport();
			break;
	}
};
</script>

<template>
	<div>
		<ClientOnly fallback-tag="span">
			<ejs-grid
				id="DefaultExport"
				ref="grid"
				:height="height"
				:enable-adaptive-ui="true"
				:data-source="tranRecords"
				:allow-sorting="true"
				:allow-paging="true"
				:allow-filtering="true"
				:allow-resizing="true"
				:page-settings="pageSettings"
				:filter-settings="filterSettings"
				:show-column-chooser="true"
				:allow-excel-export="true"
				:toolbar="toolbarOptions"
				:allow-reordering="true"
				:allow-grouping="true"
				:toolbar-click="toolbarClick"
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
						:sort-comparer="col.sortComparer"
						:display-as-check-box="col.displayAsCheckBox"
						:show-in-column-chooser="
							col.showInColumnChooser ?? true
						"
						:text-align="col.textAlign"
						:header-text-align="col.headerTextAlign"
						:visible="col.visible"
						:template="col.template"
					/>
				</e-columns>
				<template #accountTypeTemplate="{ data }">
					<div>
						<UBadge
							:label="data.glAccountClass"
							:color="
								getAccountTypeClassColor(
									data.glAccountClass
								)
							"
						/>
					<!-- <span>{{ data.glAccount.accountType.class }}</span> -->
					</div>
				</template>
			</ejs-grid>
			<template #fallback>
				<!-- this will be rendered on server side -->
				<p>Loading grid...</p>
			</template>
		</ClientOnly>
	</div>
</template>
