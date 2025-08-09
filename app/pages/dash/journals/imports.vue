<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui';

const isLoading = ref(false);

const items: StepperItem[] = [
	{
		title: 'File Upload',
		// description: 'Choose your file here',
		icon: 'i-lucide-file-up',
		disabled: true,
		value: 0,
		slot: 'fileupload' as const
	},
	{
		title: 'Field Mapping',
		// description: 'Set your preferred shipping method',
		// icon: 'i-lucide-truck',
		disabled: true,
		value: 1
	},
	{
		title: 'Preview',
		// description: 'Confirm your order',
		disabled: true,
		value: 2
	},
	{
		title: 'Process',
		// description: 'Confirm your order',
		disabled: true,
		value: 3
	}
];

const activeStep = ref(0);
</script>

<template>
	<UStepper
		ref="stepper"
		v-model="activeStep"
		:items="items"
		class="w-full"
	>
		<!-- <template #content="{ item }">
			<div class="aspect-video">
				This is the {{ item?.title }} step.
			</div>
		</template> -->
		<template #fileupload>
			<ImportPrimeCsv
				card-title="Choose Journal File"
				:is-parent-disabled="isLoading"
			/>
		</template>
	</UStepper>
</template>
