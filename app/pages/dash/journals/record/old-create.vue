<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';

const toast = useToast();

const { queryLedgerInputs } = useLedger();

const { data: ledgerData, pending: ledgerDataPending } = await queryLedgerInputs({
	periodWhere: {
		// locked: { equals: false }
	}
});

const startFirstPeriod = computed<Date>(() => {
	if (ledgerData.value && ledgerData.value.periods && ledgerData.value.periods[0]) {
		return ledgerData.value.periods[0].startDate;
	} else return new Date(2023, 11, 1);
});

const endLastPeriod = computed<Date>(() => {
	if (ledgerData.value && ledgerData.value.periods && ledgerData.value.periods.length > 0) {
		const lastPeriod = ledgerData.value.periods[ledgerData.value.periods.length - 1];
		if (lastPeriod) return lastPeriod.endDate;
	}
	return new Date(2025, 11, 31);
});

const state = reactive<Partial<TJournalCreateSchema>>({
	description: '',
	tranDate: new Date(),
	inputLines: []
});

async function onSubmit(event: FormSubmitEvent<TJournalCreateSchema>) {
	toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
	console.log(event.data);
}
</script>

<template>
	<div>
		<div>
			<h1>create journal</h1>
			<div>status: {{ String(ledgerDataPending) }}</div>
			<!-- <div v-if="ledgerData&& ledgerData.periods">
				ledgerData.periods[0]: {{ String(typeof ledgerData.periods[0]?.startDate) }}
			</div> -->
			<div>startFirstPeriod: {{ formatUSDate(startFirstPeriod) }}</div>
			<div>endLastPeriod: {{ formatUSDate(endLastPeriod) }}</div>
		</div>

		<UPageGrid v-if="ledgerData" class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				ledgerData.books:
				<pre>{{ ledgerData.books }}</pre>
			</div>
			<div>
				ledgerData.periods:
				<pre>{{ ledgerData.periods }}</pre>
			</div>
			<div>
				ledgerData.entities:
				<pre>{{ ledgerData.entities }}</pre>
			</div>
			<div>
				ledgerData.glAccounts:
				<pre>{{ ledgerData.glAccounts }}</pre>
			</div>
		</UPageGrid>
	</div>
</template>
