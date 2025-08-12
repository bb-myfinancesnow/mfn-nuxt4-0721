<template>
	<div>
		<div>ledger pivot: {{ String(eitherLoading) }}</div>
		<div>data count: {{ data.length }}</div>
	</div>
</template>

<script lang="ts" setup>
interface Props {
	data?: TFlatJournalEntryLedgerRecSchema[];
	isParentLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	isParentLoading: false
});

// Reactive state
const isLoading = ref(false);

const eitherLoading = computed(() => isLoading.value || props.isParentLoading);
</script>
