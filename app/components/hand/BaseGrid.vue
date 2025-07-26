<script lang="ts" setup>
import { HotTable } from '@handsontable/vue3';
import {
	AutoColumnSize,
	Autofill,
	ContextMenu,
	CopyPaste,
	DropdownMenu,
	Filters,
	HiddenRows,
	registerPlugin
} from 'handsontable/plugins';
import {
	CheckboxCellType,
	NumericCellType,
	DateCellType,
	registerCellType
} from 'handsontable/cellTypes';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

interface TestJournal {
	id: string;
	tranNumber: number;
	description: string;
	tranDate: string;
}

const journalTestData: TestJournal[] = [
	{
		id: 'cmcmwvvxd00qny72wajrf85og',
		tranNumber: 322,
		description: 'CHEVRON 0208850',
		tranDate: '2024-03-31T05:00:00.000Z'
	},
	{
		id: 'cmcmwvvx800qly72ww0bbwp3o',
		tranNumber: 321,
		description: 'HOUSTON OPEN',
		tranDate: '2024-03-31T05:00:00.000Z'
	},
	{
		id: 'cmcmwvvx500qjy72wkfcej7jx',
		tranNumber: 320,
		description: 'HOUSTON OPEN',
		tranDate: '2024-03-31T05:00:00.000Z'
	},
	{
		id: 'cmcmwvvx200qhy72wud0u32az',
		tranNumber: 319,
		description: 'DR ADJ REDIST CADV PRIN',
		tranDate: '2024-03-29T05:00:00.000Z'
	},
	{
		id: 'cmcmwvvwz00qfy72wsi6n6dvc',
		tranNumber: 318,
		description: 'ASTROS GOLF FOUNDATIHOUSTON TX',
		tranDate: '2024-03-29T05:00:00.000Z'
	}
];

registerCellType(CheckboxCellType);
registerCellType(NumericCellType);
registerCellType(DateCellType);
registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

const hotSettings = computed(() => {
	return {
		data: journalTestData,
		colHeaders: true,
		columns: [
			{
				title: 'ID',
				type: 'text',
				data: 'id'
			},
			{
				title: 'Tran Number',
				type: 'numeric',
				data: 'tranNumber'
			},
			{
				title: 'Description',
				type: 'text',
				data: 'description'
			},
			{
				title: 'Tran Date',
				type: 'date',
				data: 'tranDate',
				dateFormat: 'MM/DD/YYYY',
				correctFormat: true
			}
		],
		height: 'auto',
		width: 'auto',
		minSpareRows: 1,
		autoWrapRow: true,
		autoWrapCol: true,
		licenseKey: 'non-commercial-and-evaluation',
		dropdownMenu: true,
		contextMenu: true,
		filters: true,
		rowHeaders: true
	};
});
</script>

<template>
	<main>
		<div class="ht-theme-main">
			<hot-table :settings="hotSettings" />
		</div>
	</main>
</template>
