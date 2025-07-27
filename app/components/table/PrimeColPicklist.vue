<script lang="ts" setup>
interface Props {
	colOptions: IPrimeColumnProps[];
	visibleCols: IPrimeColumnProps[];
	loading?: boolean;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	disabled: false
});

const picklistModel = ref<[IPrimeColumnProps[], IPrimeColumnProps[]]>([[], []]);

const open = ref(false);

const setPicklistModel = () => {
	const hideEnabledCols = props.colOptions.filter((c) => !c.disableHide);
	const rightSide = props.visibleCols.filter((c) => !c.disableHide);

	const leftSide = hideEnabledCols.filter((c) => {
		const isVisible = rightSide.find((r) => r.colId === c.colId);
		return !isVisible;
	});
	picklistModel.value = [leftSide, rightSide];
};

onMounted(() => {
	setPicklistModel();
});
</script>

<template>
	<UModal
		v-model:open="open"
		title="Edit Columns"
		description="Choose Columns to display in table"
		:dismissible="false"
	>
		<UButton
			label="Edit Columns"
			color="neutral"
			icon="i-lucide-columns-3-cog"
			variant="subtle"
		/>

		<template #body>
			<div class="flex flex-row justify-between px-4">
				<div>
					picklistModel 0:
					<pre>{{ picklistModel[0] }}</pre>
				</div>
				<div>
					picklistModel 1:
					<pre>{{ picklistModel[1] }}</pre>
				</div>
			</div>
		</template>
	</UModal>
</template>
