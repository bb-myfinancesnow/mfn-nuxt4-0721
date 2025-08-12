<template>
	<div class="pivot-table-container">
		<div class="pivot-controls mb-6">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Row Fields -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Row Fields
					</label>
					<select
						v-model="selectedRowField"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">
							Select Row Field
						</option>
						<option v-for="field in availableFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<!-- Column Fields -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Column Fields
					</label>
					<select
						v-model="selectedColumnField"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">
							Select Column Field
						</option>
						<option v-for="field in availableFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<!-- Value Fields -->
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
			</div>

			<div class="mt-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Aggregation Function
				</label>
				<select
					v-model="aggregationFunction"
					class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

		<!-- Pivot Table -->
		<div v-if="pivotData" class="pivot-table-wrapper overflow-auto border border-gray-300 rounded-lg">
			<table class="min-w-full bg-white">
				<thead>
					<!-- Column headers -->
					<tr class="bg-gray-100">
						<th class="px-4 py-2 text-left font-medium text-gray-900 border-b border-r border-gray-300">
							{{ selectedRowField || 'Row' }}
						</th>
						<th
							v-for="col in pivotData.columns"
							:key="col"
							class="px-4 py-2 text-center font-medium text-gray-900 border-b border-r border-gray-300"
						>
							{{ col }}
						</th>
						<th class="px-4 py-2 text-center font-medium text-gray-900 border-b border-gray-300 bg-gray-200">
							Total
						</th>
					</tr>
				</thead>
				<tbody>
					<!-- Data rows -->
					<tr v-for="(row, rowKey) in pivotData.rows" :key="rowKey" class="hover:bg-gray-50">
						<td class="px-4 py-2 font-medium text-gray-900 border-b border-r border-gray-300 bg-gray-50">
							{{ rowKey }}
						</td>
						<td
							v-for="col in pivotData.columns"
							:key="col"
							class="px-4 py-2 text-center border-b border-r border-gray-300"
						>
							{{ formatValue(row[col]) }}
						</td>
						<td class="px-4 py-2 text-center font-medium border-b border-gray-300 bg-gray-100">
							{{ formatValue(row.total) }}
						</td>
					</tr>
					<!-- Totals row -->
					<tr class="bg-gray-200 font-medium">
						<td class="px-4 py-2 text-gray-900 border-r border-gray-300">
							Total
						</td>
						<td
							v-for="col in pivotData.columns"
							:key="col"
							class="px-4 py-2 text-center border-r border-gray-300"
						>
							{{ formatValue(pivotData.columnTotals[col]) }}
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
			<button
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="loadSampleData"
			>
				Load Sample Sales Data
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
interface DataRow {
	[key: string]: string | number | Date;
}

interface TestPivotData {
	rows: { [key: string]: { [key: string]: number | string; total: number } };
	columns: string[];
	columnTotals: { [key: string]: number };
	grandTotal: number;
}

type AggregationFunction = 'sum' | 'avg' | 'count' | 'min' | 'max';

// Reactive data
const data = ref<DataRow[]>([]);
const selectedRowField = ref<string>('');
const selectedColumnField = ref<string>('');
const selectedValueField = ref<string>('');
const aggregationFunction = ref<AggregationFunction>('sum');

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

const pivotData = computed((): TestPivotData | null => {
	if (!selectedRowField.value || !selectedColumnField.value || !selectedValueField.value) {
		return null;
	}

	const pivot: TestPivotData = {
		rows: {},
		columns: [],
		columnTotals: {},
		grandTotal: 0
	};

	// Get unique values for columns
	const columnValues = new Set<string>();
	data.value.forEach((row) => {
		const colValue = String(row[selectedColumnField.value]);
		columnValues.add(colValue);
	});

	pivot.columns = Array.from(columnValues).sort();

	// Initialize column totals
	pivot.columns.forEach((col) => {
		pivot.columnTotals[col] = 0;
	});

	// Process data
	data.value.forEach((row) => {
		const rowKey = String(row[selectedRowField.value]);
		const colKey = String(row[selectedColumnField.value]);
		const value = Number(row[selectedValueField.value]) || 0;

		if (!pivot.rows[rowKey]) {
			pivot.rows[rowKey] = { total: 0 };
			pivot.columns.forEach((col) => {
				pivot.rows[rowKey]![col] = 0;
			});
		}

		// Apply aggregation
		const currentValue = pivot.rows[rowKey][colKey] as number;
		pivot.rows[rowKey][colKey] = aggregate(currentValue, value, aggregationFunction.value);
	});

	// Calculate totals based on aggregation function
	Object.keys(pivot.rows).forEach((rowKey) => {
		const row = pivot.rows[rowKey];
		const rowValues: number[] = [];

		pivot.columns.forEach((col) => {
			const cellValue = row![col] as number;
			rowValues.push(cellValue);

			// Update column totals
			const currentColTotal = pivot.columnTotals[col] ?? 0;
			pivot.columnTotals[col] = aggregate(currentColTotal, cellValue, aggregationFunction.value);
		});

		// Calculate row total
		row!.total = calculateTotal(rowValues, aggregationFunction.value);
	});

	// Calculate grand total
	const allTotals = Object.values(pivot.columnTotals);
	pivot.grandTotal = calculateTotal(allTotals, aggregationFunction.value);

	return pivot;
});

// Helper functions
function aggregate(current: number, value: number, func: AggregationFunction): number {
	switch (func) {
		case 'sum':
			return current + value;
		case 'avg':
			return current + value; // Will be divided by count later
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

function calculateTotal(values: number[], func: AggregationFunction): number {
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
		return aggregationFunction.value === 'avg' ? value.toFixed(2) : value.toString();
	}
	return String(value);
}

function loadSampleData() {
	data.value = [
		{ region: 'North', product: 'Laptops', quarter: 'Q1', sales: 15000, units: 50 },
		{ region: 'North', product: 'Laptops', quarter: 'Q2', sales: 18000, units: 60 },
		{ region: 'North', product: 'Tablets', quarter: 'Q1', sales: 8000, units: 80 },
		{ region: 'North', product: 'Tablets', quarter: 'Q2', sales: 9500, units: 95 },
		{ region: 'South', product: 'Laptops', quarter: 'Q1', sales: 12000, units: 40 },
		{ region: 'South', product: 'Laptops', quarter: 'Q2', sales: 14000, units: 47 },
		{ region: 'South', product: 'Tablets', quarter: 'Q1', sales: 6000, units: 60 },
		{ region: 'South', product: 'Tablets', quarter: 'Q2', sales: 7200, units: 72 },
		{ region: 'East', product: 'Laptops', quarter: 'Q1', sales: 20000, units: 67 },
		{ region: 'East', product: 'Laptops', quarter: 'Q2', sales: 22000, units: 73 },
		{ region: 'East', product: 'Tablets', quarter: 'Q1', sales: 11000, units: 110 },
		{ region: 'East', product: 'Tablets', quarter: 'Q2', sales: 13000, units: 130 },
		{ region: 'West', product: 'Laptops', quarter: 'Q1', sales: 16000, units: 53 },
		{ region: 'West', product: 'Laptops', quarter: 'Q2', sales: 19000, units: 63 },
		{ region: 'West', product: 'Tablets', quarter: 'Q1', sales: 9000, units: 90 },
		{ region: 'West', product: 'Tablets', quarter: 'Q2', sales: 10500, units: 105 }
	];

	// Set default selections
	selectedRowField.value = 'region';
	selectedColumnField.value = 'quarter';
	selectedValueField.value = 'sales';
}

// Load sample data on mount
onMounted(() => {
	loadSampleData();
});
</script>

<style scoped>
/* Custom styles only for what Tailwind can't handle */
table {
  border-collapse: collapse;
}
</style>
