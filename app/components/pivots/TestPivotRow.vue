<template>
	<!-- Main row -->
	<tr class="hover:bg-gray-50" :class="{ 'bg-gray-25': level > 0 }">
		<td class="px-2 py-1 border-b border-r border-gray-300 text-sm" :class="indentClass">
			<div class="flex items-center gap-1">
				<button
					v-if="hasChildren"
					class="w-4 h-4 flex items-center justify-center text-xs  hover:text-gray-700"
					@click="toggleExpand"
				>
					{{ isExpanded ? '−' : '+' }}
				</button>
				<span class="font-medium" :class="{ 'text-gray-600': level > 0 }">{{ rowKey }}</span>
			</div>
		</td>
		<td
			v-for="col in columns"
			:key="col.key"
			class="px-2 py-1 text-center border-b border-r border-gray-300 text-sm"
		>
			{{ formatValue((rowData as any)[col.key]) }}
		</td>
		<td class="px-2 py-1 text-center border-b border-gray-300 text-sm font-medium bg-gray-50">
			{{ formatValue((rowData as INestedRowData)._total) }}
		</td>
	</tr>
	<template v-if="isExpanded&&hasChildren">
		<PivotsTestPivotRow
			v-for="[childKey, childData] in children"
			:key="rowKey + '-' + childKey"
			:row-data="childData"
			:row-key="childKey"
			:columns="columns"
			:level="level + 1"
			:max-level="maxLevel"
			:show-subtotals="showSubtotals"
			:expand-all="expandAll"
			@toggle-expand="$emit('toggleExpand', $event)"
		/>
	</template>
</template>

<script setup lang="ts">
interface Props {
	rowData: INestedRowData;
	rowKey: string | number;
	columns: { key: string; path: string[] }[];
	level: number;
	maxLevel: number;
	showSubtotals: boolean;
	expandAll: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	toggleExpand: [data: string];
}>();

const isExpanded = ref(props.expandAll);

const hasChildren = computed(() => {
	const rowData = props.rowData;

	return rowData.children && Object.keys(rowData.children).length > 0;
});

const children = computed(() => {
	if (!props.rowData.children) return [];
	return Object.entries(props.rowData.children);
});

function toggleExpand() {
	isExpanded.value = !isExpanded.value;
	const stringRowKey = String(props.rowKey);
	emit('toggleExpand', stringRowKey);
}

function formatValue(value: number | string | undefined | null): string {
	if (value === undefined || value === null) return '0';
	if (typeof value === 'number') {
		return value.toLocaleString();
	}
	return String(value);
}
const indentClass = computed(() => {
	const indentLevel = props.level * 4;
	return `pl-${Math.min(indentLevel, 16)}`;
});

watch(() => props.expandAll, (newVal) => {
	isExpanded.value = newVal;
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
