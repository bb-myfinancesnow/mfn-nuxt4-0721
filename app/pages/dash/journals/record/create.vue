<script lang="ts" setup>
import type { FormError, FormSubmitEvent, SelectItem } from '@nuxt/ui';
import { isBefore } from 'date-fns';
import type { DataTableRowEditSaveEvent } from 'primevue/datatable';

const toast = useToast();

const form = useTemplateRef('form');

const { queryLedgerInputs } = useLedger();

const isLoading = ref(false);

const { data: ledgerData, pending: ledgerDataPending }
	= await queryLedgerInputs({
		periodWhere: {
			locked: { equals: false }
		}
	});

const startFirstPeriod = computed<Date>(() => {
	if (
		ledgerData.value
		&& ledgerData.value.periods
		&& ledgerData.value.periods[0]
	) {
		return ledgerData.value.periods[0].startDate;
	} else return new Date(2023, 11, 1);
});

const endLastPeriod = computed<Date>(() => {
	if (
		ledgerData.value
		&& ledgerData.value.periods
		&& ledgerData.value.periods.length > 0
	) {
		const lastPeriod
			= ledgerData.value.periods[ledgerData.value.periods.length - 1];
		if (lastPeriod) return lastPeriod.endDate;
	}
	return new Date(2025, 11, 31);
});

const editingRows = ref([]);

const bookOptions = computed<SelectItem[]>(() => {
	const res: SelectItem[] = [
		{
			label: 'Clear',
			icon: 'i-lucide-x',
			value: undefined,
			chip: {
				color: 'error'
			}
		}
	];
	if (ledgerData.value && ledgerData.value.books) {
		const bookOpts: SelectItem[] = ledgerData.value.books.map((b) => ({
			label: b.name,
			value: b.id
		}));

		return [...res, ...bookOpts];
	}
	return res;
});

const entityOptions = computed<SelectItem[]>(() => {
	const res: SelectItem[] = [
		{
			label: 'Clear',
			icon: 'i-lucide-x',
			value: undefined,
			chip: {
				color: 'error'
			}
		}
	];
	if (ledgerData.value && ledgerData.value.entities) {
		const entityOpts: SelectItem[] = ledgerData.value.entities.map((b) => ({
			label: `${b.id}-${b.name}`,
			value: b.id
		}));

		return [...res, ...entityOpts];
	}
	return res;
});

const getAccountLabel = (num: number): string => {
	if (ledgerData.value && ledgerData.value.glAccounts) {
		const found = ledgerData.value.glAccounts.find(
			(a) => a.accountNumber === num
		);

		if (found) return found.accountLabel;
	}

	return `${num}`;
};

const getEntityLabel = (id: number | null | undefined): string => {
	if (
		typeof id === 'number'
		&& ledgerData.value
		&& ledgerData.value.entities
	) {
		const found = ledgerData.value.entities.find((e) => e.id === id);

		if (found) return `${found.id}-${found.name}`;
	}
	return '';
};

const state = reactive<Partial<TJournalCreateSchema>>({
	description: '',
	tranDate: new Date(),
	inputLines: [
		// {
		// 	memo: '',
		// 	glAccountNumber: 10001,
		// 	debit: 0,
		// 	credit: 0
		// }
	]
});

const validate = (state: Partial<TJournalCreateSchema>): FormError[] => {
	const errors: FormError[] = [];

	if (state.tranDate && state.reversalDate) {
		if (isBefore(state.reversalDate, state.tranDate)) {
			errors.push({
				name: 'reversalDate',
				message: 'Reversal Date must be after Posting'
			});
		}
	}

	return errors;
};

const onRowEditSave = (
	event: DataTableRowEditSaveEvent<TJournalLineCreateSchema>
) => {
	const { newData, index } = event;
	const editedNewData = newData;

	if (state && state.inputLines) {
		const editedDebit = newData.debit;
		const editedCredit = newData.credit;

		const editedAmount = editedDebit - editedCredit;

		if (editedAmount === 0) {
			editedNewData.debit = 0;
			editedNewData.credit = 0;
		} else if (editedAmount > 0) {
			editedNewData.credit = 0;
			editedNewData.debit = editedAmount;
		} else {
			editedNewData.debit = 0;
			editedNewData.credit = -1 * editedAmount;
		}

		state.inputLines[index] = editedNewData;
	}
};

const addEntryRow = () => {
	if (state && state.inputLines) {
		const debitTotal = sumValuesByProperty(state.inputLines, 'debit');
		const creditTotal = sumValuesByProperty(state.inputLines, 'credit');

		const variance = roundToHundreths(debitTotal - creditTotal);

		const debit: number = variance < 0 ? Math.abs(variance) : 0;
		const credit: number = variance > 0 ? variance : 0;

		state.inputLines.push({
			memo: '',
			glAccountNumber: 0,
			debit,
			credit
		});
	}
};

const removeLineAtIndex = (index: number) => {
	if (index >= 0 && state.inputLines && index < state.inputLines.length) {
		state.inputLines.splice(index, 1);
	}
};

const resetFormVals = async () => {
	isLoading.value = true;
	await new Promise((r) => setTimeout(r, 2000));

	isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<TJournalCreateSchema>) {
	isLoading.value = true;
	toast.add({
		title: 'Success',
		description: 'The form has been submitted.',
		color: 'success'
	});
	console.log(event.data);
	await new Promise((r) => setTimeout(r, 2000));
	isLoading.value = false;
}

const tranDatePeriod = computed<TReportPeriodSchema>(() => {
	if (state.tranDate && ledgerData.value && ledgerData.value.periods) {
		const postingMonth = state.tranDate.getMonth();
		const postingYear = state.tranDate.getFullYear();

		const lookup = ledgerData.value.periods.find(
			(p) => p.month === postingMonth && p.year === postingYear
		);

		if (lookup) return lookup;
	}

	return {
		id: 11,
		label: 'Nov 2023',
		month: 10,
		year: 2023,
		locked: true,
		startDate: new Date('2023-11-01T05:00:00.000Z'),
		endDate: new Date('2023-11-30T06:00:00.000Z'),
		quarter: 4,
		_count: {
			journals: 0
		},
		yearLabel: 'FY 2023',
		quarterLabel: 'Q4 2023'
	};
});

watch(
	() => state.reversalDate,
	(newRev, oldRev) => {
		console.log(`state's reversalDate changed from ${oldRev} to ${newRev}`);

		if (oldRev !== null && newRev === null) {
			state.reversalDate = undefined;
		}
	}
);
</script>

<template>
	<ClientOnly>
		<DisplaySpinner
			v-if="!ledgerData || !ledgerData.periods || !ledgerData.glAccounts"
		/>
		<UForm
			v-else
			id="createjournal"
			ref="form"
			:validate="validate"
			:schema="JournalCreateSchema"
			:state="state"
			@submit="onSubmit"
		>
			<UPageCard
				title="New Journal"
				description="Create a new journal entry"
				orientation="horizontal"
				class="mb-4"
			>
				<div class="grid grid-cols-1 w-fit lg:ms-auto">
					<UButton
						form="createjournal"
						label="Save Record"
						color="neutral"
						type="submit"
						:disabled="isLoading"
						:loading="isLoading"
					/>
					<UButton
						form="createjournal"
						label="Reset Journal"
						color="error"
						type="reset"
						:disabled="isLoading"
						:loading="isLoading"
						@click="resetFormVals"
					/>
				</div>
			</UPageCard>
			<UPageCard variant="subtle">
				<div class="grid grid-cols-4 gap-2 gap-x-8 py-2">
					<UFormField
						name="bookId"
						label="Book"
					>
						<USelect
							v-model="state.bookId"
							:items="bookOptions"
							:disabled="isLoading"
							:loading="isLoading"
							class="w-full"
						/>
					</UFormField>
					<UFormField
						name="description"
						label="Description"
						required
						class="col-span-3"
					>
						<UInput
							v-model="state.description"
							placeholder="Enter a header description"
							:disabled="isLoading"
							:loading="isLoading"
							class="w-7/8"
						/>
					</UFormField>
					<UFormField
						name="tranDate"
						label="Posting Date"
						required
					>
						<PDatePicker
							v-model:model-value="state.tranDate"
							:min-date="startFirstPeriod"
							:max-date="endLastPeriod"
							:disabled="isLoading"
						/>
					</UFormField>
					<UFormField label="Posting Period">
						<UBadge
							v-if="!tranDatePeriod.locked"
							color="success"
							size="xl"
						>
							{{ tranDatePeriod.label }}
						</UBadge>
						<UBadge
							v-else
							color="error"
							size="xl"
						>
							{{ tranDatePeriod.label }}
						</UBadge>
					</UFormField>
					<UFormField
						name="reversalDate"
						label="Reversal Date"
					>
						<PDatePicker
							v-model:model-value="state.reversalDate"
							:min-date="state.tranDate ?? startFirstPeriod"
							:max-date="endLastPeriod"
							:disabled="!state.tranDate || isLoading"
							:default-value="undefined"
						/>
					</UFormField>
				</div>
			</UPageCard>
			<UPageCard>
				<UFormField
					name="inputLines"
					class="rounded-2xl"
				>
					<PDataTable
						v-model:editing-rows="editingRows"
						:value="state.inputLines"
						edit-mode="row"
						class="rounded-2xl"
						@row-edit-save="onRowEditSave"
					>
						<template #header>
							<div
								class="flex flex-wrap items-center justify-between gap-2"
							>
								<span class="text-xl font-bold">Line Entries</span>
								<PButton
									icon="pi pi-plus"
									rounded
									raised
									:disabled="ledgerDataPending || isLoading"
									:loading="isLoading"
									@click="addEntryRow"
								/>
							</div>
						</template>
						<PColumn
							:row-editor="true"
							style="width: 5%; min-width: 4rem"
							body-style="text-align:center"
						/>

						<PColumn
							field="glAccountNumber"
							header="Account"
						>
							<template #editor="{ data, field }">
								<PSelect
									v-model="data[field]"
									:options="ledgerData.glAccounts"
									option-label="accountLabel"
									option-value="accountNumber"
									:disabled="ledgerDataPending || isLoading"
								/>
							</template>
							<template #body="slotProps">
								<span>{{
									getAccountLabel(
										slotProps.data.glAccountNumber
									)
								}}</span>
							</template>
						</PColumn>
						<PColumn
							header="Debit"
							field="debit"
						>
							<template #editor="{ data, field }">
								<PInputNumber
									v-model="data[field]"
									mode="currency"
									currency="USD"
									locale="en-US"
									:min-fraction-digits="2"
									:max-fraction-digits="2"
									:disabled="ledgerDataPending || isLoading"
									fluid
								/>
							</template>
							<template #body="slotProps">
								{{ formatCurrency(slotProps.data.debit) }}
							</template>
						</PColumn>
						<PColumn
							header="Credit"
							field="credit"
						>
							<template #editor="{ data, field }">
								<PInputNumber
									v-model="data[field]"
									mode="currency"
									currency="USD"
									locale="en-US"
									:min-fraction-digits="2"
									:max-fraction-digits="2"
									:disabled="ledgerDataPending || isLoading"
									fluid
								/>
							</template>
							<template #body="slotProps">
								{{ formatCurrency(slotProps.data.credit) }}
							</template>
						</PColumn>
						<PColumn
							field="entityId"
							header="Entity"
						>
							<template #editor="{ data, field }">
								<PSelect
									v-model="data[field]"
									:options="entityOptions"
									option-label="label"
									option-value="value"
									:disabled="ledgerDataPending || isLoading"
								/>
							</template>
							<template #body="slotProps">
								<span>{{
									getEntityLabel(slotProps.data.entityId)
								}}</span>
							</template>
						</PColumn>
						<PColumn
							field="memo"
							header="Memo"
						>
							<template #editor="{ data, field, index }">
								<UFormField :name="`inputLines.${index}.memo`">
									<UInput
										v-model="data[field]"
										:disabled="
											ledgerDataPending || isLoading
										"
										:loading="isLoading"
									/>
								</UFormField>
							</template>
						</PColumn>
						<PColumn
							style="width: 5%; min-width: 4rem"
							body-style="text-align:center"
						>
							<template #body="{ index }">
								<UButton
									:label="String(index)"
									icon="i-lucide-x"
									color="error"
									:disabled="ledgerDataPending || isLoading"
									:loading="isLoading"
									@click="() => removeLineAtIndex(index)"
								/>
								<!-- <UBadge :label="index" icon="i-lucide-x" color="error" /> -->
							</template>
						</PColumn>
					</PDataTable>
				</UFormField>
			</UPageCard>
			<UPageCard title="Vals">
				<div class="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
					<div>
						state:
						<pre>{{ state }}</pre>
					</div>
					<div>
						tranDatePeriod:
						<pre>{{ tranDatePeriod }}</pre>
					</div>
					<div>
						ledgerDataPending: {{ String(ledgerDataPending) }}
					</div>
					<div>
						tranDatePeriod:
						<pre>{{ form?.errors }}</pre>
					</div>
				</div>
			</UPageCard>
		</UForm>
	</ClientOnly>
</template>
