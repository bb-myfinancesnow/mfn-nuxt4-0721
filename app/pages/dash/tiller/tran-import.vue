<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { RunTillerSheetTransMutationVariables } from '~/generated/graphql';

const toast = useToast();

const isSubmitting = ref(false);

const runSheetTransFormSchema = z.object({
	createPending: z.boolean(),
	abortOnFirstMissing: z.boolean()
});

type TRunSheetTransFormSchema = z.output<typeof runSheetTransFormSchema>;

const state = reactive<Partial<TRunSheetTransFormSchema>>({
	createPending: false,
	abortOnFirstMissing: true
});

async function onSubmit(event: FormSubmitEvent<TRunSheetTransFormSchema>) {
	isSubmitting.value = true;

	const input: RunTillerSheetTransMutationVariables = event.data;
	console.log(`form input: ${JSON.stringify(input, null, 2)}`);
	await new Promise((r) => setTimeout(r, 2000));

	toast.add({
		title: 'Run Tiller Trans',
		description: `Run Tiller Trans with createPending ${String(input.createPending)} and abortOnFirstMissing ${String(input.abortOnFirstMissing)}`,
		color: 'success'
	});

	await new Promise((r) => setTimeout(r, 2000));
	isSubmitting.value = false;
}
</script>

<template>
	<UForm
		id="tillertranimport"
		:schema="runSheetTransFormSchema"
		:state="state"
		@submit="onSubmit"
	>
		<UPageCard
			title="Tiller Tran Import"
			description="These informations will be displayed publicly."
			variant="naked"
			orientation="horizontal"
			class="mb-4"
		>
			<UButton
				form="tillertranimport"
				label="Submit changes"
				color="neutral"
				type="submit"
				class="w-fit lg:ms-auto"
			/>
		</UPageCard>

		<UPageCard variant="subtle">
			<UFormField
				name="createPending"
				label="Create Pending"
			>
				<USwitch v-model="state.createPending" :loading="isSubmitting" />
			</UFormField>
			<UFormField
				name="abortOnFirstMissing"
				label="Abort On First Missing"
			>
				<USwitch v-model="state.abortOnFirstMissing" :loading="isSubmitting" />
			</UFormField>
		</UPageCard>
	</UForm>
</template>
