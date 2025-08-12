<template>
	<div>
		<!-- <UCollapsible>
			<UButton
				label="Open Pivot Setup"
				color="neutral"
				variant="subtle"
				trailing-icon="i-lucide-chevron-down"
				:disabled="eitherLoading"
				:loading="isLoading"
				block
			/>
<template #content></template>

		</UCollapsible> -->
		<UCollapsible>
			<UButton
				label="Open Pivot Setup Review"
				color="neutral"
				variant="subtle"
				trailing-icon="i-lucide-chevron-down"
				:disabled="eitherLoading"
				:loading="isLoading"
				block
			/>

			<template #content>
				<div class="flex flex-row justify-between">
					<div>
						<div>ledger pivot: {{ String(eitherLoading) }}</div>
						<div>ledgerEntries count: {{ ledgerEntries.length }}</div>
						<div>data count: {{ data.length }}</div>
						<div>showSubtotals: {{ String(showSubtotals) }}</div>
						<div>expandAll: {{ String(expandAll) }}</div>
						<div>aggregationFunction: {{ aggregationFunction }}</div>
					</div>
					<div>
						activeRowFields:
						<pre>{{ activeRowFields }}</pre>
					</div>
					<div>
						activeColumnFields:
						<pre>{{ activeColumnFields }}</pre>
					</div>
					<div>
						expandedRows:
						<pre>{{ expandedRows }}</pre>
					</div>
				</div>
			</template>
		</UCollapsible>
		<!-- <UCollapsible>
			<UButton
				label="Open Pivot"
				color="neutral"
				variant="subtle"
				trailing-icon="i-lucide-chevron-down"
				:disabled="eitherLoading"
				:loading="isLoading"
				block
			/>
<template #content>
	<div v-if="pivotData"
</template>

		</UCollapsible> -->
		<UCollapsible>
			<UButton
				label="Open Raw Pivot Info"
				color="neutral"
				variant="subtle"
				trailing-icon="i-lucide-chevron-down"
				:disabled="eitherLoading"
				:loading="isLoading"
				block
			/>

			<template #content>
				<div class="flex flex-row justify-between">
					<div>
						<div>ledger pivot: {{ String(eitherLoading) }}</div>
						<div>ledgerEntries count: {{ ledgerEntries.length }}</div>
						<div>data count: {{ data.length }}</div>
						<div>showSubtotals: {{ String(showSubtotals) }}</div>
						<div>expandAll: {{ String(expandAll) }}</div>
						<div>aggregationFunction: {{ aggregationFunction }}</div>
					</div>
					<div>
						availableFields:
						<pre>{{ availableFields }}</pre>
					</div>
					<div>
						numericFields:
						<pre>{{ numericFields }}</pre>
					</div>
					<div>
						expandedRows:
						<pre>{{ expandedRows }}</pre>
					</div>
					<div>
						data:
						<pre>{{ data }}</pre>
					</div>
				</div>
			</template>
		</UCollapsible>
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

// Reactive state
const isLoading = ref(false);

const eitherLoading = computed(() => isLoading.value || props.isParentLoading);

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

const propsToDataRows = async () => {
	isLoading.value = true;

	const newData: IPivotDataRow[] = [];
	if (props.ledgerEntries && props.ledgerEntries.length > 0) {
		for (const e of props.ledgerEntries) {
			const res = await flatEntryToDataRow(e);
			newData.push(res);
		}
	}
	data.value = newData;

	rowFields.value = ['accountClass', 'glAccountType'];
	columnFields.value = ['periodLabel'];
	selectedValueField.value = 'entryAmount';
	isLoading.value = false;
};

watch(() => props.ledgerEntries, propsToDataRows, { immediate: true });
</script>
