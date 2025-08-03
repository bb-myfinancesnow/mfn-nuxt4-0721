<script lang="ts" setup>
const { queryLedgerInputs } = useLedger();

const {
	data: inputData,
	pending
} = await queryLedgerInputs();
</script>

<template>
	<div>
		<UPageGrid v-if="inputData" class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>status: {{ String(pending) }}</div>
			<div>
				books data:
				<pre>{{ inputData.books }}</pre>
			</div>
			<div>
				entities data:
				<pre>{{ inputData.entities }}</pre>
			</div>
			<div>
				periods data:
				<pre>{{ inputData.periods }}</pre>
			</div>

			<div>
				glAccounts data:
				<pre>{{ inputData.glAccounts }}</pre>
			</div>
		</UPageGrid>
	</div>
</template>
