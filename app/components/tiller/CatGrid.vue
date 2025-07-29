<script lang="ts" setup>
import type {
	FilterSettingsModel,
	PageSettingsModel
} from '@syncfusion/ej2-grids';
import type { GridComponent } from '@syncfusion/ej2-vue-grids';
import type { ClickEventArgs } from '@syncfusion/ej2-vue-navigations';

defineProps<{
	categoryRecords: TTillerCatRecordSchema[];
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
		colId: 'name',
		field: 'name',
		headerText: 'Name',
		allowSorting: true,
		type: 'text',
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'type',
		field: 'type',
		headerText: 'Type',
		allowSorting: true,
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'group',
		field: 'group',
		headerText: 'Group',
		allowSorting: true,
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'glAccountNumber',
		field: 'glAccountNumber',
		type: 'number',
		headerText: 'GL Account',
		autoFit: true
	},
	{
		colId: '_count.tillerTrans',
		field: '_count.tillerTrans',
		headerText: 'Tran Count',
		type: 'number',
		autoFit: true,
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'createdAt',
		field: 'createdAt',
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

// const height = ref(500);

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
				:enable-adaptive-ui="true"
				:data-source="categoryRecords"
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
							:label="data.glAccount.accountType.class"
							:color="
								getAccountTypeClassColor(
									data.glAccount.accountType.class
								)
							"
						/>
					<!-- <span>{{ data.glAccount.accountType.class }}</span> -->
					</div>
				</template>
			</ejs-grid>
			<template #fallback>
				<!-- this will be rendered on server side -->
				<p>Loading comments...</p>
			</template>
		</ClientOnly>
	</div>
</template>
