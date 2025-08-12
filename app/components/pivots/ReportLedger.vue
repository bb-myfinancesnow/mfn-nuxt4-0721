<template>
	<div>
		<UCollapsible>
			<UButton
				label="Open Pivot Setup Review"
				color="neutral"
				variant="subtle"
				trailing-icon="i-lucide-chevron-down"
				:disabled="eitherLoading"
				:loading="loading"
				block
			/>

			<template #content>
				<div class="flex flex-row justify-between">
					<div>
						<div>ledger pivot: {{ String(eitherLoading) }}</div>
						<div>ledgerEntries count: {{ ledgerEntries.length }}</div>
						<div>data count: {{ pivotTable.rows.length }}</div>
						<div>hasHierarchy: {{ String(hasHierarchy) }}</div>
						<!-- <div>showSubtotals: {{ String(showSubtotals) }}</div> -->
					</div>
					<div>
						rows:
						<pre>{{ pivotTable.rows }}</pre>
					</div>
					<div>
						headers:
						<pre>{{ pivotTable.headers }}</pre>
					</div>
					<div>
						totals:
						<pre>{{ pivotTable.totals }}</pre>
					</div>
				</div>
			</template>
		</UCollapsible>
		<div v-if="pivotTable.headers.length >0" class="overflow-x-auto">
			<table class="w-full border-collapse border">
				<!-- Headers -->
				<thead>
					<tr>
						<th class="border p-3 text-left font-semibold sticky left-0 z-10 min-w-[200px]">
							{{ config.rows.join(' / ') }}
						</th>
						<th
							v-for="header in pivotTable.headers"
							:key="header"
							class="border  p-3 text-center font-semibold min-w-[120px]"
						>
							{{ header }}
						</th>
						<th class="border p-3 text-center font-semibold min-w-[120px]">
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
							'hover:bg-gray-500',
							row.isGroup ? 'bg-gray-400' : '',
							`level-${row.level}`
						]"
					>
						<td class="border  p-3 font-medium sticky left-0 z-10">
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
										class="w-4 h-4"
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
									class="ml-2 px-2 py-1 text-xs rounded-full"
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
							class="border border-gray-300 p-3 text-right"
							:class="{ 'font-semibold': row.isGroup }"
						>
							{{ formatValue(row.total.value) }}
							<!-- <small v-if="config.aggregation !== 'count'" class="block text-gray-500">
								({{ row.total.count }})
							</small> -->
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
interface Props {
	ledgerEntries?: TFlatJournalEntryLedgerRecSchema[];
	isParentLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	ledgerEntries: () => [],
	isParentLoading: false
});

const {
	createPivotTable,
	getVisibleRows,
	toggleRowExpansion,
	expandAll,
	collapseAll
} = useReportPivot();

// Reactive state
const loading = ref(false);
const error = ref('');
const allRows = ref<ILedgerPivotRow[]>([]);
const pivotTable = ref<ILedgerPivotTable>({
	headers: [],
	rows: [],
	totals: [],
	grandTotal: { value: 0, count: 0 }
});

const config = ref<PivotConfig>({
	rows: ['accountClass', 'glAccountType'],
	columns: ['periodId'],
	values: ['entryAmount'],
	aggregation: 'sum'
});
// Computed properties
const visibleRows = computed(() => getVisibleRows(allRows.value));
const hasHierarchy = computed(() => config.value.rows.length > 1);

const eitherLoading = computed(() => loading.value || props.isParentLoading);

const refreshPivot = () => {
	if (props.ledgerEntries.length === 0) {
		error.value = 'No data available';
		return;
	}

	if (
		config.value.rows.length === 0
		|| config.value.columns.length === 0
		|| config.value.values.length === 0
	) {
		error.value
			= 'Please select at least one field for rows, columns, and values';
		return;
	}

	const data = props.ledgerEntries.map((e) => flatEntryToLedgerPivotRow(e));
	const table = createPivotTable(data, config.value);
	pivotTable.value = table;
	allRows.value = table.rows;
};

// Toggle row expansion
const toggleExpansion = (rowId: string) => {
	allRows.value = toggleRowExpansion(allRows.value, rowId);
};

// Expand all rows
const _expandAllRows = () => {
	allRows.value = expandAll(allRows.value);
};

// Collapse all rows
const _collapseAllRows = () => {
	allRows.value = collapseAll(allRows.value);
};

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

// Watch for data changes
watch(() => props.ledgerEntries, () => {
	if (props.ledgerEntries.length > 0) {
		refreshPivot();
	}
}, { immediate: true });

// Watch for config changes
watch(config, refreshPivot, { deep: true });
</script>
