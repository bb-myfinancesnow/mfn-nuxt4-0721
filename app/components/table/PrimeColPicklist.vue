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
			:loading="loading||disabled"
			:disabled="disabled"
		/>

		<template #body>
			<PPickList
				v-model="picklistModel"
				data-key="colId"
				breakpoint="2000px"
				scroll-height="120rem"
			>
				<!-- <template #option="{ option }">
					{{ option.displayLabel }}
				</template> -->
				<template #option="{ option, selected }">
					<div class="flex flex-wrap p-1 items-center gap-4 w-full">
						<div class="flex-1 flex flex-col">
							<span class="font-medium text-sm">{{ option.displayLabel }}</span>
							<span :class="['text-sm', { 'text-surface-500 dark:text-surface-400': !selected, 'text-inherit': selected }]">{{ option.colId }}</span>
						</div>
					</div>
				</template>
			</PPickList>
			<!-- <div class="flex flex-row justify-between px-4">
				<div>
					picklistModel 0:
					<pre>{{ picklistModel[0] }}</pre>
				</div>
				<div>
					picklistModel 1:
					<pre>{{ picklistModel[1] }}</pre>
				</div>
			</div> -->
		</template>
	</UModal>
</template>
