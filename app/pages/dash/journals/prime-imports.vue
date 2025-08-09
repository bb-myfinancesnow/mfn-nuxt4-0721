<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui';

const isLoading = ref(false);

const uploadedFile = ref<File>();

const stepper = useTemplateRef('stepper');

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

const canAdvanceStepZero = computed<string>(() => {
	if (isLoading.value) {
		return `Page is Loading`;
	} else if (!uploadedFile.value) {
		return `Must upload file to proceed`;
	} else {
		return `Next Step`;
	}
});

const advanceToMapping = async () => {
	isLoading.value = true;
	await new Promise((r) => setTimeout(r, 2000));
	isLoading.value = false;
};
</script>

<template>
	<div class="w-full">
		<UStepper
			ref="stepper"
			v-model="activeStep"
			:items="items"
			class="w-full"
		>
			<template #fileupload>
				<ImportPrimeCsv
					v-model:upload-file="uploadedFile"
					card-title="Choose Journal File"
					:is-parent-disabled="isLoading"
				/>
			</template>
		</UStepper>
		<div v-if="activeStep===0">
			<UTooltip :text="canAdvanceStepZero">
				<UButton
					label="Next"
					trailing-icon="i-lucide-arrow-right"
					:disabled="canAdvanceStepZero !=='Next Step' || isLoading ||!uploadedFile"
					:loading="isLoading"
					class="w-1/4 place-items-center justify-center text-center"
					@click="advanceToMapping"
				/>
			</UTooltip>
		</div>
		<div class="flex gap-2 justify-between mt-4">
			<UButton
				v-if="activeStep>0"
				leading-icon="i-lucide-arrow-left"
				:disabled="!stepper?.hasPrev ||isLoading||!uploadedFile"
				:loading="isLoading"
				@click="stepper?.prev()"
			>
				Prev
			</UButton>

			<UButton
				v-if="activeStep>0"
				trailing-icon="i-lucide-arrow-right"
				:disabled="!stepper?.hasNext||isLoading"
				:loading="isLoading"
				@click="stepper?.next()"
			>
				Next
			</UButton>
		</div>
		<div v-if="uploadedFile">
			<h2>{{ uploadedFile.name }}</h2>
		</div>
	</div>
</template>
