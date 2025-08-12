<template>
	<div class="pivot-table-container">
		<div class="pivot-controls mb-6">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Row Fields -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-gray-900">
						Row Fields
					</h3>
					<div class="space-y-2">
						<div v-for="(field, index) in rowFields" :key="`row-${index}`" class="flex items-center gap-2">
							<select
								v-model="rowFields[index]"
								class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">
									Select Field
								</option>
								<option v-for="field in availableFields" :key="field" :value="field">
									{{ field }}
								</option>
							</select>
							<button
								v-if="rowFields.length > 1"
								class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
								title="Remove field"
								@click="removeRowField(index)"
							>
								✕
							</button>
						</div>
						<button
							class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm"
							@click="addRowField"
						>
							+ Add Row Field
						</button>
					</div>
				</div>

				<!-- Column Fields -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-gray-900">
						Column Fields
					</h3>
					<div class="space-y-2">
						<div v-for="(field, index) in columnFields" :key="`col-${index}`" class="flex items-center gap-2">
							<select
								v-model="columnFields[index]"
								class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">
									Select Field
								</option>
								<option v-for="field in availableFields" :key="field" :value="field">
									{{ field }}
								</option>
							</select>
							<button
								v-if="columnFields.length > 1"
								class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
								title="Remove field"
								@click="removeColumnField(index)"
							>
								✕
							</button>
						</div>
						<button
							class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm"
							@click="addColumnField"
						>
							+ Add Column Field
						</button>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<!-- Value Field -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Value Field
					</label>
					<select
						v-model="selectedValueField"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">
							Select Value Field
						</option>
						<option v-for="field in numericFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<!-- Aggregation Function -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Aggregation Function
					</label>
					<select
						v-model="aggregationFunction"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="sum">
							Sum
						</option>
						<option value="avg">
							Average
						</option>
						<option value="count">
							Count
						</option>
						<option value="min">
							Minimum
						</option>
						<option value="max">
							Maximum
						</option>
					</select>
				</div>
			</div>

			<!-- Display Options -->
			<div class="mt-4 flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input
						v-model="showSubtotals"
						type="checkbox"
						class="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
					>
					<span class="text-sm text-gray-700">Show Subtotals</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						v-model="expandAll"
						type="checkbox"
						class="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
					>
					<span class="text-sm text-gray-700">Expand All</span>
				</label>
			</div>
		</div>

		<!-- Pivot Table -->
		<div v-if="pivotData" class="pivot-table-wrapper overflow-auto border border-gray-300 rounded-lg max-h-96">
			<table class="min-w-full bg-white">
				<thead class="sticky top-0 bg-white z-10">
					<!-- Column header rows -->
					<tr v-for="(headerRow, level) in pivotData.columnHeaders" :key="`header-${level}`" class="bg-gray-100">
						<!-- Row field headers -->
						<th
							v-if="level === 0"
							:rowspan="pivotData.columnHeaders.length"
							class="px-4 py-2 text-left font-medium text-gray-900 border-b border-r border-gray-300 bg-gray-200"
						>
							<div
								v-for="(field, i) in activeRowFields"
								:key="field"
								class="text-xs"
								:class="{ 'mt-1': i > 0 }"
							>
								{{ field }}
							</div>
						</th>
						<!-- Column headers -->
						<th
							v-for="header in headerRow"
							:key="header.key"
							:colspan="header.colspan"
							class="px-2 py-1 text-center font-medium text-gray-900 border-b border-r border-gray-300 text-xs"
							:class="{ 'bg-gray-50': level > 0 }"
						>
							{{ header.label }}
						</th>
						<!-- Total header -->
						<th
							v-if="level === 0"
							:rowspan="pivotData.columnHeaders.length"
							class="px-4 py-2 text-center font-medium border-b border-gray-300 bg-gray-200"
						>
							Total
						</th>
					</tr>
				</thead>
				<tbody>
					<!-- Data rows -->
					<template v-for="(rowGroup, groupKey) in pivotData.rows" :key="groupKey">
						<PivotsTestPivotRow
							:row-data="rowGroup"
							:row-key="groupKey"
							:columns="pivotData.leafColumns"
							:level="0"
							:max-level="activeRowFields.length - 1"
							:show-subtotals="showSubtotals"
							:expand-all="expandAll"
							@toggle-expand="toggleRowExpansion"
						/>
					</template>
					<!-- Grand totals row -->
					<tr class="bg-gray-200 font-medium border-t-2 border-gray-400">
						<td :colspan="activeRowFields.length" class="px-4 py-2 text-gray-900 border-r border-gray-300">
							Grand Total
						</td>
						<td
							v-for="col in pivotData.leafColumns"
							:key="col.key"
							class="px-2 py-2 text-center border-r border-gray-300 text-sm"
						>
							{{ formatValue(pivotData.columnTotals[col.key]) }}
						</td>
						<td class="px-4 py-2 text-center bg-gray-300">
							{{ formatValue(pivotData.grandTotal) }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Sample Data Controls -->
		<div class="mt-6 p-4 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-medium text-gray-900 mb-2">
				Sample Data
			</h3>
			<div class="flex flex-wrap gap-2">
				<button
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					@click="loadSampleSalesData"
				>
					Load Sales Data
				</button>
				<button
					class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
					@click="loadSampleEmployeeData"
				>
					Load Employee Data
				</button>
			</div>
		</div>
		<div v-if="pivotData" class="flex flex-row justify-between">
			<div>
				rows:
				<pre>{{ pivotData.rows }}</pre>
			</div>
			<div>
				columnHeaders:
				<pre>{{ pivotData.columnHeaders }}</pre>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
// Reactive data
const data = ref<IPivotDataRow[]>([]);
const rowFields = ref<string[]>(['']);
const columnFields = ref<string[]>(['']);
const selectedValueField = ref<string>('');
const aggregationFunction = ref<TAggregationFunction>('sum');
const showSubtotals = ref(true);
const expandAll = ref(false);
const expandedRows = ref<Set<string>>(new Set());

// Computed properties
const availableFields = computed(() => {
	if (data.value.length === 0) return [];
	return Object.keys(data.value[0]!);
});

const numericFields = computed(() => {
	if (data.value.length === 0) return [];
	return Object.keys(data.value[0]!).filter((key) =>
		typeof data.value[0]![key] === 'number'
	);
});

const activeRowFields = computed(() => rowFields.value.filter((f) => f !== ''));
const activeColumnFields = computed(() => columnFields.value.filter((f) => f !== ''));

const pivotData = computed((): IPivotData | null => {
	if (activeRowFields.value.length === 0 || activeColumnFields.value.length === 0 || !selectedValueField.value) {
		return null;
	}

	const pivot: IPivotData = {
		rows: {},
		columnHeaders: [],
		leafColumns: [],
		columnTotals: {},
		grandTotal: 0
	};

	// Build column structure
	const columnTree = buildColumnTree(data.value, activeColumnFields.value);
	console.log(` tet columnTree: ${JSON.stringify(columnTree, null, 2)}`);

	pivot.columnHeaders = buildColumnHeaders(columnTree);
	pivot.leafColumns = getLeafColumns(columnTree);

	// Initialize column totals
	pivot.leafColumns.forEach((col) => {
		pivot.columnTotals[col.key] = 0;
	});

	// Build row structure and calculate values
	data.value.forEach((row) => {
		const rowPath = activeRowFields.value.map((field) => String(row[field]));
		const colPath = activeColumnFields.value.map((field) => String(row[field]));
		const colKey = colPath.join('|');
		const value = Number(row[selectedValueField.value]) || 0;

		// Navigate/create row structure
		let currentRowLevel = pivot.rows;
		for (let i = 0; i < rowPath.length; i++) {
			const pathKey = rowPath[i]!;
			if (!currentRowLevel[pathKey]) {
				currentRowLevel[pathKey] = {
					_total: 0,
					_isLeaf: i === rowPath.length - 1,
					_expanded: expandAll.value,
					_level: i
				};
			}

			// Add value to current level
			const currentValue = (currentRowLevel[pathKey][colKey] as number) || 0;
			(currentRowLevel[pathKey] as any)[colKey] = aggregate(currentValue, value, aggregationFunction.value);

			// Update total
			const currentTotal = (currentRowLevel[pathKey] as INestedRowData)._total || 0;
			(currentRowLevel[pathKey] as INestedRowData)._total = aggregate(currentTotal, value, aggregationFunction.value);

			if (i < rowPath.length - 1) {
				// Move to next level
				const currentRow = currentRowLevel[pathKey] as INestedRowData;
				if (!currentRow.children) {
					currentRow.children = {};
				}
				currentRowLevel = currentRow.children;
			}
		}

		// Update column totals
		const currentColTotal = pivot.columnTotals[colKey] || 0;
		pivot.columnTotals[colKey] = aggregate(currentColTotal, value, aggregationFunction.value);
	});

	// Calculate grand total
	const allTotals = Object.values(pivot.columnTotals);
	pivot.grandTotal = calculateTotal(allTotals, aggregationFunction.value);

	return pivot;
});

// Column tree building functions
function buildColumnTree(data: IPivotDataRow[], fields: string[]) {
	const tree: any = {};

	data.forEach((row) => {
		let current = tree;
		fields.forEach((field, index) => {
			const value = String(row[field]);
			if (!current[value]) {
				current[value] = index === fields.length - 1 ? null : {};
			}
			if (index < fields.length - 1) {
				current = current[value];
			}
		});
	});

	return tree;
}

function buildColumnHeaders(tree: any, level = 0, path: string[] = []): IPivotColumnHeader[][] {
	if (!tree || typeof tree !== 'object') return [];

	const headers: IPivotColumnHeader[][] = [];
	const currentLevel: IPivotColumnHeader[] = [];

	Object.keys(tree).sort().forEach((key) => {
		const currentPath = [...path, key];
		const childHeaders = buildColumnHeaders(tree[key], level + 1, currentPath);

		let colspan = 1;
		if (childHeaders.length > 0) {
			colspan = childHeaders[0]!.length;
		}

		currentLevel.push({
			key: currentPath.join('|'),
			label: key,
			colspan
		});

		// Merge child headers
		childHeaders.forEach((childLevel, index) => {
			if (!headers[index]) headers[index] = [];
			headers[index].push(...childLevel);
		});
	});

	return [currentLevel, ...headers];
}

function getLeafColumns(tree: any, path: string[] = []): { key: string; path: string[] }[] {
	if (!tree || typeof tree !== 'object') {
		return [{ key: path.join('|'), path }];
	}

	const leaves: { key: string; path: string[] }[] = [];
	Object.keys(tree).sort().forEach((key) => {
		const currentPath = [...path, key];
		leaves.push(...getLeafColumns(tree[key], currentPath));
	});

	return leaves;
}

// Field management functions
function addRowField() {
	rowFields.value.push('');
}

function removeRowField(index: number) {
	if (rowFields.value.length > 1) {
		rowFields.value.splice(index, 1);
	}
}

function addColumnField() {
	columnFields.value.push('');
}

function removeColumnField(index: number) {
	if (columnFields.value.length > 1) {
		columnFields.value.splice(index, 1);
	}
}

// Helper functions
function aggregate(current: number, value: number, func: TAggregationFunction): number {
	switch (func) {
		case 'sum':
			return current + value;
		case 'avg':
			return current + value;
		case 'count':
			return current + 1;
		case 'min':
			return current === 0 ? value : Math.min(current, value);
		case 'max':
			return Math.max(current, value);
		default:
			return current + value;
	}
}

function calculateTotal(values: number[], func: TAggregationFunction): number {
	switch (func) {
		case 'sum':
			return values.reduce((sum, val) => sum + val, 0);
		case 'avg':
			return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
		case 'count':
			return values.reduce((sum, val) => sum + val, 0);
		case 'min':
			return values.length > 0 ? Math.min(...values) : 0;
		case 'max':
			return values.length > 0 ? Math.max(...values) : 0;
		default:
			return values.reduce((sum, val) => sum + val, 0);
	}
}

function formatValue(value: number | string | undefined): string {
	if (value === undefined || value === null) return '0';
	if (typeof value === 'number') {
		if (aggregationFunction.value === 'avg') {
			return value.toFixed(2);
		}
		return value.toLocaleString();
	}
	return String(value);
}

function toggleRowExpansion(rowKey: string) {
	if (expandedRows.value.has(rowKey)) {
		expandedRows.value.delete(rowKey);
	} else {
		expandedRows.value.add(rowKey);
	}
}

// Sample data functions
function loadSampleSalesData() {
	data.value = [
		{ region: 'North', country: 'USA', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Jan', sales: 15000, units: 50, profit: 3000 },
		{ region: 'North', country: 'USA', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Feb', sales: 18000, units: 60, profit: 3600 },
		{ region: 'North', country: 'USA', product: 'Tablets', category: 'Electronics', quarter: 'Q1', month: 'Jan', sales: 8000, units: 80, profit: 1600 },
		{ region: 'North', country: 'Canada', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Jan', sales: 12000, units: 40, profit: 2400 },
		{ region: 'North', country: 'Canada', product: 'Tablets', category: 'Electronics', quarter: 'Q2', month: 'Apr', sales: 9500, units: 95, profit: 1900 },
		{ region: 'South', country: 'Brazil', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Jan', sales: 14000, units: 47, profit: 2800 },
		{ region: 'South', country: 'Brazil', product: 'Tablets', category: 'Electronics', quarter: 'Q1', month: 'Feb', sales: 6000, units: 60, profit: 1200 },
		{ region: 'South', country: 'Mexico', product: 'Laptops', category: 'Electronics', quarter: 'Q2', month: 'May', sales: 16000, units: 53, profit: 3200 },
		{ region: 'East', country: 'Japan', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Mar', sales: 20000, units: 67, profit: 4000 },
		{ region: 'East', country: 'Japan', product: 'Tablets', category: 'Electronics', quarter: 'Q2', month: 'Jun', sales: 11000, units: 110, profit: 2200 },
		{ region: 'East', country: 'China', product: 'Laptops', category: 'Electronics', quarter: 'Q2', month: 'Apr', sales: 22000, units: 73, profit: 4400 },
		{ region: 'West', country: 'UK', product: 'Laptops', category: 'Electronics', quarter: 'Q1', month: 'Feb', sales: 19000, units: 63, profit: 3800 },
		{ region: 'West', country: 'Germany', product: 'Tablets', category: 'Electronics', quarter: 'Q1', month: 'Mar', sales: 10500, units: 105, profit: 2100 }
	];

	// Set default selections for multi-level
	rowFields.value = ['region', 'country'];
	columnFields.value = ['quarter', 'month'];
	selectedValueField.value = 'sales';
}

function loadSampleEmployeeData() {
	data.value = [
		{ department: 'Engineering', team: 'Frontend', level: 'Senior', location: 'Remote', employees: 5, salary: 95000, bonus: 15000 },
		{ department: 'Engineering', team: 'Frontend', level: 'Junior', location: 'Office', employees: 8, salary: 65000, bonus: 8000 },
		{ department: 'Engineering', team: 'Backend', level: 'Senior', location: 'Remote', employees: 6, salary: 98000, bonus: 16000 },
		{ department: 'Engineering', team: 'Backend', level: 'Mid', location: 'Office', employees: 10, salary: 80000, bonus: 12000 },
		{ department: 'Sales', team: 'Enterprise', level: 'Senior', location: 'Office', employees: 4, salary: 85000, bonus: 25000 },
		{ department: 'Sales', team: 'SMB', level: 'Mid', location: 'Remote', employees: 7, salary: 70000, bonus: 18000 },
		{ department: 'Marketing', team: 'Digital', level: 'Senior', location: 'Remote', employees: 3, salary: 88000, bonus: 12000 },
		{ department: 'Marketing', team: 'Content', level: 'Mid', location: 'Office', employees: 5, salary: 72000, bonus: 9000 }
	];

	rowFields.value = ['department', 'team'];
	columnFields.value = ['level', 'location'];
	selectedValueField.value = 'salary';
}

// Watch for expand all changes
watch(expandAll, (newVal) => {
	if (newVal) {
		// Add logic to expand all rows if needed
	}
});

onMounted(() => {
	loadSampleSalesData();
});
</script>
