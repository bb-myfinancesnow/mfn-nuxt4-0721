<script lang="ts" setup>
const { queryLedgerInputs } = useLedger();

const { data: ledgerData, pending: ledgerDataPending } = await queryLedgerInputs({
	periodWhere: {
		locked: { equals: false }
	}
});
</script>

<template>
	<div>
		<div>
			<h1>create journal</h1>
			<div>status: {{ String(ledgerDataPending) }}</div>
			<div v-if="ledgerData&& ledgerData.periods">
				ledgerData.periods[0]: {{ String(typeof ledgerData.periods[0]?.startDate) }}
			</div>
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
