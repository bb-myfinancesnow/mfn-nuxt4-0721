export const usePivotTable = () => {
	const createPivotTable = (data: SalesData[], config: PivotConfig): PivotTable => {
		if (!data.length) {
			return {
				headers: [],
				rows: [],
				totals: [],
				grandTotal: { value: 0, count: 0 }
			};
		}

		// Get unique values for columns
		const columnValues = [...new Set(
			data.map((item) => config.columns.map((col) => item[col as keyof SalesData]).join(' | '))
		)].sort();

		// Get unique values for rows
		const rowValues = [...new Set(
			data.map((item) => config.rows.map((row) => item[row as keyof SalesData]).join(' | '))
		)].sort();

		// Create pivot structure
		const pivotData: Record<string, Record<string, number[]>> = {};

		// Initialize pivot structure
		rowValues.forEach((rowKey) => {
			pivotData[rowKey] = {};
			columnValues.forEach((colKey) => {
				pivotData[rowKey]![colKey] = [];
			});
		});

		// Populate pivot data
		data.forEach((item) => {
			const rowKey = config.rows.map((row) => item[row as keyof SalesData]).join(' | ');
			const colKey = config.columns.map((col) => item[col as keyof SalesData]).join(' | ');
			const value = config.values.reduce((sum, val) => sum + Number(item[val as keyof SalesData] || 0), 0);

			if (pivotData[rowKey] && pivotData[rowKey][colKey] !== undefined) {
				pivotData[rowKey][colKey].push(value);
			}
		});

		// Aggregate data based on configuration
		const aggregate = (values: number[]): PivotCell => {
			if (values.length === 0) return { value: 0, count: 0 };

			let result: number;
			switch (config.aggregation) {
				case 'sum':
					result = values.reduce((a, b) => a + b, 0);
					break;
				case 'count':
					result = values.length;
					break;
				case 'average':
					result = values.reduce((a, b) => a + b, 0) / values.length;
					break;
				case 'min':
					result = Math.min(...values);
					break;
				case 'max':
					result = Math.max(...values);
					break;
				default:
					result = values.reduce((a, b) => a + b, 0);
			}

			return { value: result, count: values.length };
		};

		// Build pivot table structure
		const rows = rowValues.map((rowKey) => {
			const cells = columnValues.map((colKey) =>
				aggregate(pivotData[rowKey]![colKey] || [])
			);

			const rowTotal = aggregate(
				columnValues.flatMap((colKey) => pivotData[rowKey]![colKey] || [])
			);

			return {
				label: rowKey,
				cells,
				total: rowTotal
			};
		});

		// Calculate column totals
		const totals = columnValues.map((colKey) =>
			aggregate(
				rowValues.flatMap((rowKey) => pivotData[rowKey]![colKey] || [])
			)
		);

		// Calculate grand total
		const allValues = Object.values(pivotData)
			.flatMap((row) => Object.values(row))
			.flat();
		const grandTotal = aggregate(allValues);

		return {
			headers: columnValues,
			rows,
			totals,
			grandTotal
		};
	};

	return { createPivotTable };
};
