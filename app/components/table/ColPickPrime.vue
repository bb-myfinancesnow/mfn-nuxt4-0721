<script lang="ts" setup generic="T">
interface Props {
	colOptions: IPrimeColumnConfig<T>[];
	visibleCols: IPrimeColumnConfig<T>[];
	loading?: boolean;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	disabled: false
});

const emit = defineEmits<{
	updateCols: [cols: IPrimeColumnConfig<T>[]];
}>();

const picklistModel = ref<[IPrimeColumnConfig<T>[], IPrimeColumnConfig<T>[]]>([[], []]);

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

const saveColSelection = () => {
	const res: IPrimeColumnConfig<T>[] = [];

	const mustShowCols = props.visibleCols.filter((c) => !!c.disableHide);

	res.push(...mustShowCols);

	const rightSideIds = picklistModel.value[1].map((p) => p.colId);
	console.log(`new col ids`, rightSideIds);

	for (const cId of rightSideIds) {
		const colEntry = props.colOptions.find((v) => v.colId === cId);
		if (colEntry) res.push(colEntry);
	}

	// const viewables = props.colOptions.filter((v) => rightSideIds.includes(v.colId as string));
	// res.push(...viewables);

	console.log(`new cols`, res);

	emit('updateCols', res);
	open.value = false;
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
		:ui="{
			body: 'w-full'
		}"
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
				striped
				:responsive="false"
				scroll-height="50rem"
				class="max-h-screen"
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
			<USeparator class="py-5" />
			<div class="flex justify-center">
				<UButton
					label="Save"
					color="neutral"
					variant="outline"
					icon="i-lucide-pin"
					size="xl"
					@click="saveColSelection"
				/>
			</div>
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
