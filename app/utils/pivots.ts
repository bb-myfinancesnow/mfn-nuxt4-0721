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

export interface PivotCell {
	value: number;
	count: number;
}

export interface PivotTable {
	headers: string[];
	rows: Array<{
		label: string;
		cells: PivotCell[];
		total: PivotCell;
	}>;
	totals: PivotCell[];
	grandTotal: PivotCell;
}
