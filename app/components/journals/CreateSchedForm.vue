<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { add, getDate, isBefore } from 'date-fns';
import * as z from 'zod';
import { RecurrenceFrequency, Weekday, type NewTranSchedMutationVariables, type TranSchedResultInfoFragment } from '~/generated/graphql';

const { genNewTranSchedule } = useSchedules();

interface Props {
	templateJournal: TJournalPageRecordSchema;
	isOpenDisabled: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	savedNew: [TranSchedResultInfoFragment];
}>();

const form = useTemplateRef('form');

const toast = useToast();

const minStartDateVal = computed<Date>(() => {
	const minStartDate = add(props.templateJournal.tranDate, { days: 1 });
	return minStartDate;
});

const schema = z.object({
	name: z.string().min(3, {
		message: 'Name must be at least 3 characters.'
	}),
	startDate: z.coerce.date().min(minStartDateVal.value),
	endDate: z.coerce.date().optional().nullable(),
	frequency: z.nativeEnum(RecurrenceFrequency),
	interval: z.coerce.number().int().min(1),
	isActive: z.boolean(),
	dayOfMonth: z.number().int().optional(),
	dayOfWeek: z.nativeEnum(Weekday).optional(),
	genToDate: z.date().optional(),
	templateJournalId: z.string()
}).superRefine((val, ctx) => {
	// console.log(`end date is ${val.endDate}`);
	if (val.endDate && val.endDate !== null) {
		// console.log(`checking end date ${val.endDate}`);
		if (isBefore(val.endDate, val.startDate)) {
			ctx.addIssue({
				code: z.ZodIssueCode.invalid_date,
				message: 'End Must be After Start',
				path: ['endDate']
			});
		}
	}
});

type Schema = z.output<typeof schema>;

const open = ref(false);

const state = ref<Partial<Schema>>({
	name: undefined,
	startDate: new Date(props.templateJournal.tranDate),
	interval: 1,
	isActive: true,
	templateJournalId: props.templateJournal.id
});

const isSubmitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log(`start create sched`);
	isSubmitting.value = true;

	const { templateJournalId, genToDate, ...input } = event.data;

	const vars: NewTranSchedMutationVariables = {
		templateJournalId,
		genToDate,
		dto: input
	};

	console.log(`form input vars: ${JSON.stringify(vars, null, 2)}`);

	try {
		const res = await genNewTranSchedule(vars);

		toast.add({
			title: 'New Schedule ${res.createTranSchedule.name}',
			description: `New Schedule ${res.createTranSchedule.name} added with ${res.createTranSchedule._count.scheduleLogs} logs`,
			color: 'success',
			duration: 2000
		});
		await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;

		emit('savedNew', res.createTranSchedule);
		open.value = false;
		resetForm();
	} catch (e) {
		console.error(`error submit: ${e}`);
		await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;
	}
}

const resetForm = () => {
	state.value = {
		name: undefined,
		startDate: props.templateJournal.tranDate,
		interval: 1,
		isActive: true,
		templateJournalId: props.templateJournal.id
	};
	if (form.value) {
		form.value.errors = [];
	}
};

const canShowSetupCard = computed<boolean>(() => {
	if (!props.templateJournal) return false;
	else if (
		!state.value.frequency
		|| !state.value.name
		|| !state.value.interval
	)
		return false;
	return true;
});

type TSetSchedStartParams = {
	freq?: RecurrenceFrequency;
	interval?: number;
};

const setDefaultStartDate = async ({
	freq,
	interval
}: TSetSchedStartParams) => {
	isSubmitting.value = true;
	await new Promise((r) => setTimeout(r, 2000));
	const baseDateVal = props.templateJournal.tranDate;
	console.log(
		`setDefaultStartDate baseDateVal type ${typeof baseDateVal} and val ${baseDateVal}`
	);
	// if(!props.templateJournal || !props.templateJournal.tranDate){

	// }

	if (!open.value) {
		isSubmitting.value = false;
	}

	if (!freq || !interval) {
		console.log(`missing param`);

		state.value.startDate = baseDateVal;
		state.value.dayOfMonth = undefined;
		state.value.dayOfWeek = undefined;
		// await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;
	} else {
		console.log(`has freq ${freq} and interval ${interval}`);

		if (freq === RecurrenceFrequency.Weekly) {
			state.value.dayOfMonth = undefined;

			const dayOfWeekVal = await getWeekdayOption(
				props.templateJournal.tranDate
			);

			state.value.dayOfWeek = dayOfWeekVal.value;
		} else {
			state.value.dayOfWeek = undefined;

			const dayOfMonthVal = getDate(props.templateJournal.tranDate);

			state.value.dayOfMonth = dayOfMonthVal;
		}

		await setCalcStartDate();

		// await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;
	}
};

const defaultSchedDates = ref<TSchedStartResult>();

const setCalcStartDate = async () => {
	isSubmitting.value = true;

	const params: TCalcSchedStartParams = {
		freq: state.value.frequency ?? undefined,
		interval: state.value.interval ?? undefined,
		dayOfMonth: state.value.dayOfMonth ?? undefined,
		tranDate: props.templateJournal.tranDate
	};

	if (state.value.dayOfWeek) {
		params.dayOfWeek = await getWeekdayFromValue(state.value.dayOfWeek);
	}

	const res = await calcSchedStart(params);
	defaultSchedDates.value = res;

	state.value.startDate = res.defaultStartDate;

	isSubmitting.value = false;
};

watch(
	() => state.value.frequency,
	async (newFreq, oldFreq) => {
		console.log('freq changed:', oldFreq, '->', newFreq);

		const interval = state.value.interval;
		await setDefaultStartDate({ freq: newFreq, interval });
	}
);

// watch(
// 	[() => state.value.frequency, () => state.value.interval],
// 	([newFreq, newInt], [oldFreq, oldInt]) => {
// 		console.log('freq changed:', oldFreq, '->', newFreq);
// 		console.log('interval changed:', oldInt, '->', newInt);

// 		setDefaultStartDate({ freq: newFreq, interval: newInt });
// 	}
// );
</script>

<template>
	<UForm
		id="createtransched"
		ref="form"
		:state="state"
		:schema="schema"
		@submit="onSubmit"
	>
		<UModal
			v-model:open="open"
			title="New Tran Schedule"
			:close="{ onClick: () => resetForm() }"
			:dismissible="false"
			fullscreen
			description="Generate a new transaction generate schedule"
			:ui="{ footer: 'justify-center' }"
		>
			<UButton
				label="New Schedule"
				icon="i-lucide-plus"
				:disabled="isOpenDisabled || isSubmitting"
				:loading="isSubmitting"
			/>

			<template #body>
				<UPageCard title="Schedule" variant="subtle">
					<div class="grid grid-cols-6 gap-2 gap-x-8 py-2">
						<UFormField
							label="Name"
							placeholder="Scratch Book"
							name="name"
							required
							class="col-span-5"
						>
							<UInput
								v-model="state.name"
								class="w-full"
								:disabled="isSubmitting || isOpenDisabled"
								:loading="isSubmitting"
							/>
						</UFormField>
						<UFormField
							name="isActive"
							class="w-full content-center"
						>
							<USwitch
								v-model="state.isActive"
								:disabled="isSubmitting || isOpenDisabled"
								:loading="isSubmitting"
								label="Active"
								class="w-full justify-center"
							/>
						</UFormField>
						<UFormField
							label="Frequency"
							name="frequency"
							required
							class="col-span-4"
						>
							<USelect
								v-model="state.frequency"
								:items="frequencyOptions"
								class="w-full"
								:disabled="isSubmitting || isOpenDisabled"
								:loading="isSubmitting"
							/>
						</UFormField>
						<UFormField
							label="Interval"
							name="interval"
							required
							class="col-span-2"
						>
							<UInputNumber
								v-model="state.interval"
								orientation="vertical"
								:min="1"
								:disabled="isSubmitting || isOpenDisabled"
								:loading="isSubmitting"
							/>
						</UFormField>
					</div>
				</UPageCard>
				<UPageCard v-if="canShowSetupCard" title="Details">
					<div class="grid grid-cols-6 gap-2 gap-x-8 py-2">
						<UFormField
							name="dayOfWeek"
							label="Day of Week"
							class="col-span-3"
						>
							<USelect
								v-model="state.dayOfWeek"
								:items="weekdayValOptions"
								class="w-full"
								:disabled="
									isSubmitting
										|| isOpenDisabled
										|| state.frequency !== RecurrenceFrequency.Weekly
								"
								:loading="isSubmitting"
							/>
						</UFormField>
						<UFormField
							name="dayOfMonth"
							label="Day of Month"
							class="col-span-3"
						>
							<UInputNumber
								v-model="state.dayOfMonth"
								:min="1"
								:max="31"
								:disabled="
									isSubmitting
										|| isOpenDisabled
										|| state.frequency === RecurrenceFrequency.Weekly
								"
								:loading="isSubmitting"
							/>
						</UFormField>
						<UFormField
							name="startDate"
							label="Start Date"
							required
							class="col-span-2 w-full"
						>
							<PDatePicker
								v-model:model-value="state.startDate"
								:disabled="isSubmitting || isOpenDisabled"
								:min-date="minStartDateVal"
								fluid
							/>
						</UFormField>
						<UFormField
							name="endDate"
							label="End Date"
							class="col-span-2 w-full content-center"
						>
							<PDatePicker
								v-model:model-value="state.endDate"
								name="endDate"
								:disabled="isSubmitting || isOpenDisabled"
								fluid
							/>
						</UFormField>
						<UFormField
							name="genToDate"
							label="Gen To Date"
							class="col-span-2 w-full content-center"
						>
							<PDatePicker
								v-model:model-value="state.genToDate"
								name="genToDate"
								:disabled="isSubmitting || isOpenDisabled||!state.startDate"
								fluid
							/>
						</UFormField>
					</div>
				</UPageCard>
				<!-- <UPageCard
					v-if="canShowDatesCard"
					variant="subtle"
				>
					<div class="grid grid-cols-6 gap-2 gap-x-8 py-2">
						<UFormField
							name="startDate"
							label="Start Date"
							required
							class="col-span-3"
						>
							<PDatePicker
								v-model:model-value="state.startDate"
								:disabled="isSubmitting || isOpenDisabled"
								:min-date="minStartDateVal"
							/>
						</UFormField>
						<UFormField
							name="endDate"
							label="End Date"
							class="col-span-3"
						>
							<PDatePicker
								v-model:model-value="state.endDate"
								:disabled="isSubmitting || isOpenDisabled"
							/>
						</UFormField>
					</div>
				</UPageCard> -->
				<div class="flex flex-row justify-between">
					<div>
						<h2>State Vals</h2>
						<pre>{{ state }}</pre>
					</div>
					<div>
						<h2>defaultSchedDates Vals</h2>
						<pre>{{ defaultSchedDates }}</pre>
					</div>
					<div>
						<h2>error Vals</h2>
						<pre>{{ form?.errors }}</pre>
					</div>
				</div>
			</template>

			<template #footer>
				<UButton
					label="Reset Form"
					color="error"
					variant="outline"
					:disabled="isOpenDisabled || isSubmitting"
					:loading="isSubmitting"
					@click="resetForm"
				/>
				<UButton
					form="createtransched"
					label="Save Schedule"
					color="neutral"
					type="submit"
					:disabled="isOpenDisabled || isSubmitting"
					:loading="isSubmitting"
				/>
			</template>
		</UModal>
	</UForm>
</template>
