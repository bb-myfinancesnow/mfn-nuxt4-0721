<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import {
	SortOrder,
	type RunTillerSheetTransMutationVariables
} from '~/generated/graphql';

const toast = useToast();

const isSubmitting = ref(false);

const runSheetTransFormSchema = z.object({
	createPending: z.boolean(),
	abortOnFirstMissing: z.boolean()
});

type TRunSheetTransFormSchema = z.output<typeof runSheetTransFormSchema>;

const { searchTillerTranRecs, runTillerSheetTrans } = useTiller();

const { data: tillerData, pending, refresh: refreshTillerQuery } = await searchTillerTranRecs({
	orderBy: [
		{ date: SortOrder.Desc },
		{ dateAdded: SortOrder.Desc },
		{ id: SortOrder.Asc }
	],
	where: {
		reconciled: { equals: false },
		excluded: { equals: false },
		generatedJournal: { is: null }
	}
});

const state = reactive<Partial<TRunSheetTransFormSchema>>({
	createPending: false,
	abortOnFirstMissing: true
});

const pendingGenCount = computed<number>(() => {
	return tillerData.value.length;
});

const runNewTranCount = ref<number>(0);
const runCreatedCount = ref<number>(0);

async function onSubmit(event: FormSubmitEvent<TRunSheetTransFormSchema>) {
	isSubmitting.value = true;
	runNewTranCount.value = 0;
	runCreatedCount.value = 0;

	const input: RunTillerSheetTransMutationVariables = event.data;
	console.log(`form input: ${JSON.stringify(input, null, 2)}`);
	await new Promise((r) => setTimeout(r, 2000));

	toast.add({
		title: 'Run Tiller Trans',
		description: `Import Tiller Trans with createPending ${String(input.createPending)} and abortOnFirstMissing ${String(input.abortOnFirstMissing)}`,
		color: 'info'
	});

	try {
		const res = await runTillerSheetTrans(input);
		console.log(`onSubmit runTillerSheetTrans res: ${JSON.stringify(res, null, 2)}`);
		runNewTranCount.value = res.newTranCount;
		runCreatedCount.value = res.createdCount;
	} catch (e) {
		console.error(`error submit TRunSheetTransFormSchema: ${e}`);
	}
	await new Promise((r) => setTimeout(r, 2000));
	await refreshTillerQuery();
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
				:disabled="pending||isSubmitting"
				:loading="isSubmitting"
			/>
		</UPageCard>

		<UPageCard variant="subtle">
			<UFormField
				name="createPending"
				label="Create Pending"
			>
				<USwitch
					v-model="state.createPending"
					:disabled="pending||isSubmitting"
					:loading="isSubmitting"
				/>
			</UFormField>
			<UFormField
				name="abortOnFirstMissing"
				label="Abort On First Missing"
			>
				<USwitch
					v-model="state.abortOnFirstMissing"
					:disabled="pending||isSubmitting"
					:loading="isSubmitting"
				/>
			</UFormField>
		</UPageCard>
		<DisplaySpinner v-if="pending||isSubmitting" />
		<UPageGrid v-else class="lg:grid-cols-4 gap-4 sm:gap-6">
			<UPageCard
				title="Pending Create Count"
				variant="subtle"
				icon="i-lucide-banknote-x"
			>
				<div class="flex items-center gap-2">
					<DisplayCountto
						prefix="Pending: "
						class="text-2xl font-semibold text-highlighted"
						:end-value="pendingGenCount"
						:duration="3000"
					/>
				</div>
			</UPageCard>
			<UPageCard
				title="Last Run New Count"
				variant="subtle"
				icon="i-lucide-banknote-x"
			>
				<div class="flex items-center gap-2">
					<DisplayCountto
						class="text-2xl font-semibold text-highlighted"
						:end-value="runNewTranCount"
						:duration="3000"
					/>
				</div>
			</UPageCard>
			<UPageCard
				title="Last Run Created"
				variant="subtle"
				icon="i-lucide-banknote-x"
			>
				<div class="flex items-center gap-2">
					<DisplayCountto
						class="text-2xl font-semibold text-highlighted"
						:end-value="runCreatedCount"
						:duration="3000"
					/>
				</div>
			</UPageCard>
		</UPageGrid>
	</UForm>
</template>
