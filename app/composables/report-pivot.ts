export const useReportPivot = () => {
	const createPivotTable = (data: ILedgerPivotRowData[], config: PivotConfig): ILedgerPivotTable => {
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
			data.map((item) => config.columns.map((col) => item[col as keyof ILedgerPivotRowData]).join(' | '))
		)].sort();

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

		// Create hierarchical row structure
		const createHierarchicalRows = (): ILedgerPivotRow[] => {
			const rowHierarchy: Map<string, ILedgerPivotRow> = new Map();
			let rowIdCounter = 0;

			// Group data by hierarchical levels
			const groupByLevel = (items: ILedgerPivotRowData[], level: number, parentId: string | null = null, parentPrefix: string = ''): void => {
				if (level >= config.rows.length) return;

				const currentField = config.rows[level];
				const groups = new Map<string, ILedgerPivotRowData[]>();

				// Group items by current field
				items.forEach((item) => {
					const key = String(item[currentField as keyof ILedgerPivotRowData]);
					if (!groups.has(key)) {
						groups.set(key, []);
					}
					groups.get(key)!.push(item);
				});

				// Create rows for each group
				Array.from(groups.entries())
					.sort(([a], [b]) => a.localeCompare(b))
					.forEach(([groupKey, groupItems]) => {
						const rowId = `row_${rowIdCounter++}`;
						const isLeaf = level === config.rows.length - 1;
						const fullLabel = parentPrefix ? `${parentPrefix} | ${groupKey}` : groupKey;

						// Calculate cells for this row
						const cells = columnValues.map((colKey) => {
							const matchingItems = groupItems.filter((item) => {
								const itemColKey = config.columns.map((col) => item[col as keyof ILedgerPivotRowData]).join(' | ');
								return itemColKey === colKey;
							});
							const values = matchingItems.map((item) =>
								config.values.reduce((sum, val) => sum + Number(item[val as keyof ILedgerPivotRowData] || 0), 0)
							);
							return aggregate(values);
						});

						// Calculate row total
						const allValues = groupItems.map((item) =>
							config.values.reduce((sum, val) => sum + Number(item[val as keyof ILedgerPivotRowData] || 0), 0)
						);
						const total = aggregate(allValues);

						const row: ILedgerPivotRow = {
							id: rowId,
							label: isLeaf ? fullLabel : groupKey,
							level,
							isGroup: !isLeaf,
							isExpanded: level < 2, // Default: expand first 2 levels
							parentId,
							children: [],
							cells,
							total,
							rawData: groupItems
						};

						rowHierarchy.set(rowId, row);

						// Add to parent's children
						if (parentId && rowHierarchy.has(parentId)) {
							rowHierarchy.get(parentId)!.children.push(rowId);
						}

						// Recursively create child rows if not at leaf level
						if (!isLeaf) {
							groupByLevel(groupItems, level + 1, rowId, fullLabel);
						}
					});
			};

			groupByLevel(data, 0);
			return Array.from(rowHierarchy.values()).sort((a, b) => {
				if (a.level !== b.level) return a.level - b.level;
				return a.label.localeCompare(b.label);
			});
		};

		const rows = createHierarchicalRows();

		// Calculate column totals
		const totals = columnValues.map((colKey) => {
			const matchingItems = data.filter((item) => {
				const itemColKey = config.columns.map((col) => item[col as keyof ILedgerPivotRowData]).join(' | ');
				return itemColKey === colKey;
			});
			const values = matchingItems.map((item) =>
				config.values.reduce((sum, val) => sum + Number(item[val as keyof ILedgerPivotRowData] || 0), 0)
			);
			return aggregate(values);
		});

		// Calculate grand total
		const allValues = data.map((item) =>
			config.values.reduce((sum, val) => sum + Number(item[val as keyof ILedgerPivotRowData] || 0), 0)
		);
		const grandTotal = aggregate(allValues);

		return {
			headers: columnValues,
			rows,
			totals,
			grandTotal
		};
	};

	const getVisibleRows = (allRows: ILedgerPivotRow[]): ILedgerPivotRow[] => {
		const visible: ILedgerPivotRow[] = [];
		const processRow = (row: ILedgerPivotRow, parentExpanded: boolean = true): void => {
			if (parentExpanded) {
				visible.push(row);
			}

			if (row.isExpanded && parentExpanded) {
				row.children.forEach((childId) => {
					const childRow = allRows.find((r) => r.id === childId);
					if (childRow) {
						processRow(childRow, true);
					}
				});
			}
		};

		// Process top-level rows
		allRows.filter((row) => row.parentId === null).forEach((row) => {
			processRow(row);
		});

		return visible;
	};

	const toggleRowExpansion = (allRows: ILedgerPivotRow[], rowId: string): ILedgerPivotRow[] => {
		return allRows.map((row) => {
			if (row.id === rowId) {
				return { ...row, isExpanded: !row.isExpanded };
			}
			return row;
		});
	};

	const expandAll = (allRows: ILedgerPivotRow[]): ILedgerPivotRow[] => {
		return allRows.map((row) => ({ ...row, isExpanded: true }));
	};

	const collapseAll = (allRows: ILedgerPivotRow[]): ILedgerPivotRow[] => {
		return allRows.map((row) => ({ ...row, isExpanded: row.level === 0 }));
	};
	return {
		createPivotTable,
		getVisibleRows,
		toggleRowExpansion,
		expandAll,
		collapseAll
	};
};
