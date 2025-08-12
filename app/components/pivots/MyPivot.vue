<script lang="ts" setup>
// Props
interface Props {
	data?: SalesData[];
}

const props = withDefaults(defineProps<Props>(), {
	data: () => []
});

// Composables
const { createPivotTable, getVisibleRows, toggleRowExpansion, expandAll, collapseAll } = usePivotTable();

// Reactive state
const loading = ref(false);
const error = ref('');
const allRows = ref<PivotRow[]>([]);
const pivotTable = ref<PivotTable>({
	headers: [],
	rows: [],
	totals: [],
	grandTotal: { value: 0, count: 0 }
});

const config = ref<PivotConfig>({
	rows: ['region', 'salesperson'],
	columns: ['product'],
	values: ['amount'],
	aggregation: 'sum'
});

// Available fields for configuration
const availableFields = ['product', 'region', 'salesperson', 'category', 'date'];
const numericFields = ['amount'];

// Computed properties
const visibleRows = computed(() => getVisibleRows(allRows.value));
const hasHierarchy = computed(() => config.value.rows.length > 1);

// Format value for display
const formatValue = (value: number): string => {
	if (config.value.aggregation === 'count') {
		return value.toString();
	}

	if (config.value.values.includes('amount')) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	return value.toLocaleString();
};

// Refresh pivot table
const refreshPivot = () => {
	if (props.data.length === 0) {
		error.value = 'No data available';
		return;
	}

	if (config.value.rows.length === 0 || config.value.columns.length === 0 || config.value.values.length === 0) {
		error.value = 'Please select at least one field for rows, columns, and values';
		return;
	}

	error.value = '';
	const table = createPivotTable(props.data, config.value);
	pivotTable.value = table;
	allRows.value = table.rows;
};

// Toggle row expansion
const toggleExpansion = (rowId: string) => {
	allRows.value = toggleRowExpansion(allRows.value, rowId);
};

// Expand all rows
const expandAllRows = () => {
	allRows.value = expandAll(allRows.value);
};

// Collapse all rows
const collapseAllRows = () => {
	allRows.value = collapseAll(allRows.value);
};

// Watch for data changes
watch(() => props.data, () => {
	if (props.data.length > 0) {
		refreshPivot();
	}
}, { immediate: true });

// Watch for config changes
watch(config, refreshPivot, { deep: true });
</script>

<template>
	<div class="pivot-table-container">
		<!-- Configuration Panel -->
		<div class="config-panel mb-6 p-4 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-4">
				Pivot Configuration
			</h3>

			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<label class="block text-sm font-medium mb-2">Rows</label>
					<select
						v-model="config.rows"
						multiple
						class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option v-for="field in availableFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Columns</label>
					<select
						v-model="config.columns"
						multiple
						class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option v-for="field in availableFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Values</label>
					<select
						v-model="config.values"
						multiple
						class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option v-for="field in numericFields" :key="field" :value="field">
							{{ field }}
						</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Aggregation</label>
					<select
						v-model="config.aggregation"
						class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="sum">
							Sum
						</option>
						<option value="count">
							Count
						</option>
						<option value="average">
							Average
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

			<div class="flex gap-2 mt-4">
				<button
					:disabled="loading"
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
					@click="refreshPivot"
				>
					{{ loading ? 'Loading...' : 'Update Pivot Table' }}
				</button>

				<button
					:disabled="!hasHierarchy"
					class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
					@click="expandAllRows"
				>
					Expand All
				</button>

				<button
					:disabled="!hasHierarchy"
					class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
					@click="collapseAllRows"
				>
					Collapse All
				</button>
			</div>
		</div>

		<!-- Error Display -->
		<div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<p class="text-red-700">
				{{ error }}
			</p>
		</div>

		<!-- Pivot Table -->
		<div v-if="pivotTable.headers.length > 0" class="pivot-table overflow-x-auto">
			<table class="w-full border-collapse border border-gray-300 bg-white">
				<!-- Headers -->
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-300 p-3 text-left font-semibold sticky left-0 bg-gray-100 z-10 min-w-[200px]">
							{{ config.rows.join(' / ') }}
						</th>
						<th
							v-for="header in pivotTable.headers"
							:key="header"
							class="border border-gray-300 p-3 text-center font-semibold min-w-[120px]"
						>
							{{ header }}
						</th>
						<th class="border border-gray-300 p-3 text-center font-semibold bg-blue-50 min-w-[120px]">
							Total
						</th>
					</tr>
				</thead>

				<!-- Data Rows -->
				<tbody>
					<tr
						v-for="row in visibleRows"
						:key="row.id"
						:class="[
							'hover:bg-gray-50',
							row.isGroup ? 'bg-gray-25' : '',
							`level-${row.level}`
						]"
					>
						<td class="border border-gray-300 p-3 font-medium sticky left-0 bg-white z-10">
							<div class="flex items-center" :style="{ paddingLeft: `${row.level * 20}px` }">
								<!-- Expand/Collapse Button -->
								<button
									v-if="row.isGroup"
									class="flex items-center justify-center w-6 h-6 mr-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
									:title="row.isExpanded ? 'Collapse' : 'Expand'"
									@click="toggleExpansion(row.id)"
								>
									<svg
										class="w-4 h-4 transform transition-transform"
										:class="{ 'rotate-90': row.isExpanded }"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>

								<!-- Row Icon -->
								<div class="flex items-center mr-2">
									<svg
										v-if="row.isGroup"
										class="w-4 h-4 text-blue-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
									</svg>
									<svg
										v-else
										class="w-4 h-4 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd" />
									</svg>
								</div>

								<!-- Row Label -->
								<span
									:class="[
										row.isGroup ? 'font-semibold text-gray-800' : 'text-gray-700',
										`text-${Math.min(row.level + 1, 4)}xl`
									]"
								>
									{{ row.label }}
								</span>

								<!-- Item Count for Groups -->
								<span
									v-if="row.isGroup"
									class="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full"
								>
									{{ row.children.length }}
								</span>
							</div>
						</td>

						<!-- Data Cells -->
						<td
							v-for="(cell, cellIndex) in row.cells"
							:key="cellIndex"
							class="border border-gray-300 p-3 text-right"
							:class="{ 'font-semibold': row.isGroup }"
						>
							{{ formatValue(cell.value) }}
							<small v-if="config.aggregation !== 'count'" class="block text-gray-500">
								({{ cell.count }})
							</small>
						</td>

						<!-- Total Cell -->
						<td
							class="border border-gray-300 p-3 text-right bg-blue-50"
							:class="{ 'font-semibold': row.isGroup }"
						>
							{{ formatValue(row.total.value) }}
							<small v-if="config.aggregation !== 'count'" class="block text-gray-500">
								({{ row.total.count }})
							</small>
						</td>
					</tr>
				</tbody>

				<!-- Totals Row -->
				<tfoot>
					<tr class="bg-gray-100 font-semibold">
						<td class="border border-gray-300 p-3 sticky left-0 bg-gray-100 z-10">
							<div class="flex items-center">
								<svg class="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
								</svg>
								Total
							</div>
						</td>
						<td
							v-for="(total, index) in pivotTable.totals"
							:key="index"
							class="border border-gray-300 p-3 text-right"
						>
							{{ formatValue(total.value) }}
							<small v-if="config.aggregation !== 'count'" class="block text-gray-500">
								({{ total.count }})
							</small>
						</td>
						<td class="border border-gray-300 p-3 text-right bg-blue-100">
							{{ formatValue(pivotTable.grandTotal.value) }}
							<small v-if="config.aggregation !== 'count'" class="block text-gray-500">
								({{ pivotTable.grandTotal.count }})
							</small>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>

		<div v-else-if="!loading" class="text-center p-8 text-gray-500">
			<p>Configure the pivot table settings above to display data</p>
		</div>
	</div>
</template>
