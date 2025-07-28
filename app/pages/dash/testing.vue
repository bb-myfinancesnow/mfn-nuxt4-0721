<script lang="ts" setup>
import type {
	ColumnModel,
	FilterSettingsModel,
	PageSettingsModel
} from '@syncfusion/ej2-grids';
import type { GridComponent } from '@syncfusion/ej2-vue-grids';
import type { ClickEventArgs } from '@syncfusion/ej2-vue-navigations';
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
	// refresh: refreshJournalQuery
} = await ledgerData.searchGlEntryRecs({
	orderBy: [{ journal: { tranNumber: SortOrder.Asc } }, { id: SortOrder.Asc }]
});

interface ISyncColModel extends ColumnModel {
	colId: string;
}

const toolbarOptions = ['ExcelExport', 'CsvExport', 'ColumnChooser'];

const grid = useTemplateRef<GridComponent>('grid');

const getPeriodId = (label: string): number => {
	const rec = jeData.value.find((e) => e.periodLabel === label);

	if (rec) {
		return rec.periodId;
	} else {
		return 1;
	}
};

const gridCols = ref<ISyncColModel[]>([
	{
		colId: 'id',
		field: 'id',
		headerText: 'ID',
		allowSorting: true,
		type: 'number',
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'journalNumber',
		field: 'journalNumber',
		headerText: 'JE#',
		allowSorting: true,
		type: 'number',
		autoFit: true,
		showInColumnChooser: true
	},
	{
		colId: 'postingDate',
		field: 'postingDate',
		headerText: 'Posting Date',
		autoFit: true,
		type: 'date',
		format: {
			type: 'date',
			format: 'MM/dd/yyyy'
		}
	},
	{
		colId: 'periodLabel',
		field: 'periodLabel',
		headerText: 'Period',
		autoFit: true,
		sortComparer: (reference, comparer) => {
			const refId = getPeriodId(String(reference));
			const compId = getPeriodId(String(comparer));

			if (refId < compId) {
				return -1;
			}
			if (refId > compId) {
				return 1;
			}
			return 0;
		}
	},
	{
		colId: 'periodLocked',
		field: 'periodLocked',
		autoFit: true,
		headerText: 'Locked',
		type: 'boolean',
		displayAsCheckBox: true,
		allowSorting: false,
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'glAccountLabel',
		field: 'glAccountLabel',
		autoFit: true,
		headerText: 'GL Account'
	},
	{
		colId: 'isDebit',
		field: 'isDebit',
		autoFit: true,
		headerText: 'Is Debit',
		type: 'boolean',
		displayAsCheckBox: true,
		allowSorting: false,
		textAlign: 'Center',
		headerTextAlign: 'Center'
	},
	{
		colId: 'entryAmount',
		field: 'entryAmount',
		headerText: 'Amount',
		autoFit: true,
		allowSorting: true,
		type: 'number',
		textAlign: 'Right',
		format: 'C2'
	},
	{
		colId: 'memo',
		field: 'memo',
		headerText: 'Memo',
		allowSorting: false
	},
	{
		colId: 'glAccount.accountType.class',
		field: 'glAccount.accountType.class',
		autoFit: true,
		headerText: 'Account Class',
		template: 'accountTypeTemplate'
	},
	{
		colId: 'glAccount.accountTypeName',
		field: 'glAccount.accountTypeName',
		headerText: 'Account Type',
		autoFit: true,
		visible: false
	}
]);

const pageSettings = ref<PageSettingsModel>({
	pageSizes: [5, 10, 25, 50, 100],
	pageSize: 10
});

const filterSettings = ref<FilterSettingsModel>({
	type: 'Excel'
});

const height = ref('100%');

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
				<!-- <FusionEntryBase :is-loading="pending" :entry-data="jeData" /> -->
				<ejs-grid
					id="DefaultExport"
					ref="grid"
					:enable-adaptive-ui="true"
					:height="height"
					:data-source="jeData"
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
			</ClientOnly>
			<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
				<div>status: {{ String(pending) }}</div>
				<div>
					gridCols:
					<pre>{{ gridCols }}</pre>
				</div>
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
