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

const { getTillerTranAgg, runTillerSheetTrans } = useTiller();

const {
	data: tillerData,
	pending,
	refresh: refreshTillerQuery
} = await getTillerTranAgg();

const state = reactive<Partial<TRunSheetTransFormSchema>>({
	createPending: false,
	abortOnFirstMissing: true
});

const pendingGenCount = computed<number>(() => {
	return tillerData.value?.unRecCount ?? 0;
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
		console.log(
			`onSubmit runTillerSheetTrans res: ${JSON.stringify(res, null, 2)}`
		);
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
		id="importtillertrans"
		:schema="runSheetTransFormSchema"
		:state="state"
		@submit="onSubmit"
	>
		<UPageGrid class="grid-cols-4 gap-4">
			<UPageCard
				title="Tiller Tran Import"
				description="These informations will be displayed publicly."
				variant="soft"
				orientation="horizontal"
				class="mb-4 col-span-2"
			>
				<div class="flex flex-col">
					<UButton
						label="Refresh Query"
						icon="i-lucide-refresh-ccw"
						class="ml-auto"
						:disabled="pending || isSubmitting"
						:loading="isSubmitting"
						@click="refreshTillerQuery()"
					/>
					<UButton
						form="importtillertrans"
						label="Submit changes"
						color="neutral"
						type="submit"
						class="ml-auto"
						:disabled="pending || isSubmitting"
						:loading="isSubmitting"
					/>
					<!-- <UButton
						label="Generate All Pending"
						class="ml-auto"
						:disabled="
							pending || isSubmitting || tillerData.length === 0
						"
						:loading="isSubmitting"
						@click="submitAllPending"
					/> -->
				</div>
			</UPageCard>
			<UPageCard
				title="Settings"
				variant="soft"
			>
				<UFormField
					name="createPending"
					label="Create Pending"
				>
					<USwitch
						v-model="state.createPending"
						:disabled="pending || isSubmitting"
						:loading="isSubmitting"
					/>
				</UFormField>
				<UFormField
					name="abortOnFirstMissing"
					label="Abort On First Missing"
				>
					<USwitch
						v-model="state.abortOnFirstMissing"
						:disabled="pending || isSubmitting"
						:loading="isSubmitting"
					/>
				</UFormField>
			</UPageCard>
		</UPageGrid>
		<USeparator class="py-5" />
		<DisplaySpinner v-if="pending || isSubmitting || !tillerData" />
		<UPageGrid
			v-else
			class="lg:grid-cols-4 gap-4 sm:gap-6"
		>
			<UPageCard
				title="Existing Transactions"
				variant="subtle"
				icon="i-lucide-database"
			>
				<div class="flex items-center gap-2">
					<DisplayCountto
						class="text-2xl font-semibold text-highlighted"
						:end-value="tillerData.idCount"
						prefix="Total Trans: "
						:duration="3000"
					/>
				</div>
			</UPageCard>
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
			<UPageCard
				title="Latest Tiller Tran Date"
				variant="subtle"
				icon="i-lucide-calendar"
			>
				<div class="flex items-center gap-2">
					<span
						v-if="tillerData.maxDate"
						class="text-2xl font-semibold text-highlighted"
					>{{ formatUSDate(tillerData.maxDate) }}</span>
					<span v-else>None</span>
				</div>
			</UPageCard>
			<UPageCard
				title="Latest Tiller Add Date"
				variant="subtle"
				icon="i-lucide-calendar"
			>
				<div class="flex items-center gap-2">
					<span
						v-if="tillerData.maxDateAdded"
						class="text-2xl font-semibold text-highlighted"
					>{{ formatUSDate(tillerData.maxDateAdded) }}</span>
					<span v-else>None</span>
				</div>
			</UPageCard>
			<UPageCard
				title="Latest Tiller Tran Created"
				variant="subtle"
				icon="i-lucide-calendar"
			>
				<div class="flex items-center gap-2">
					<span
						v-if="tillerData.maxCreatedAt"
						class="text-2xl font-semibold text-highlighted"
					>{{ formatUSDate(tillerData.maxCreatedAt) }}</span>
					<span v-else>None</span>
				</div>
			</UPageCard>
			<UPageCard
				title="First Tiller Tran Date"
				variant="subtle"
				icon="i-lucide-calendar"
			>
				<div class="flex items-center gap-2">
					<span
						v-if="tillerData.minDate"
						class="text-2xl font-semibold text-highlighted"
					>{{ formatUSDate(tillerData.minDate) }}</span>
					<span v-else>None</span>
				</div>
			</UPageCard>
		</UPageGrid>
	</UForm>
	<!-- <div>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div> -->
</template>
