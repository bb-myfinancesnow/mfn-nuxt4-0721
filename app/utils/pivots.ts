import { getMonth, getQuarter, getYear } from 'date-fns';

export interface SalesData {
	id: string;
	product: string;
	region: string;
	salesperson: string;
	amount: number;
	date: string;
	category: string;
}

export interface PivotConfig {
	rows: string[];
	columns: string[];
	values: string[];
	aggregation: 'sum' | 'count' | 'average' | 'min' | 'max';
}

export interface PivotRow {
	id: string;
	label: string;
	level: number;
	isGroup: boolean;
	isExpanded: boolean;
	parentId: string | null;
	children: string[];
	cells: PivotCell[];
	total: PivotCell;
	rawData: SalesData[];
}

export interface PivotCell {
	value: number;
	count: number;
}

export interface PivotTable {
	headers: string[];
	rows: PivotRow[];
	totals: PivotCell[];
	grandTotal: PivotCell;
}

export interface IPivotDataRow {
	[key: string]: string | number | Date;
}

export interface IPivotColumnHeader {
	key: string;
	label: string;
	colspan: number;
}

export interface INestedRowData {
	[key: string]: INestedRowData | number | boolean | undefined;
	_total?: number;
	_isLeaf?: boolean;
	_expanded?: boolean;
	_level?: number;
	children?: { [key: string]: INestedRowData };
}

export interface IPivotData {
	rows: { [key: string]: INestedRowData };
	columnHeaders: IPivotColumnHeader[][];
	leafColumns: { key: string; path: string[] }[];
	columnTotals: { [key: string]: number };
	grandTotal: number;
}

export type TAggregationFunction = 'sum' | 'avg' | 'count' | 'min' | 'max';

export const flatEntryToDataRow = async (entry: TFlatJournalEntryLedgerRecSchema): Promise<IPivotDataRow> => {
	const {
		periodId,
		periodLabel,
		postingDate,
		glAccountLabel,
		entryAmount,
		journalNumber,
		id,
		glAccount,
		debit,
		credit
	} = entry;

	const periodQuarter = getQuarter(postingDate);
	const postingMonth = getMonth(postingDate);
	const postingYear = getYear(postingDate);

	return {
		periodId,
		periodLabel,
		postingDate,
		periodQuarter,
		postingMonth,
		postingYear,
		glAccountLabel,
		entryAmount,
		journalNumber,
		id,
		glAccountType: glAccount.accountTypeName,
		glAccountTypeSortOrder: glAccount.accountType.sortOrder,
		accountClass: glAccount.accountType.class,
		debit,
		credit

	};
};
