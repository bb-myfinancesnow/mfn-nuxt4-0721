<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
	// refresh: refreshJournalQuery
} = await ledgerData.searchGlEntryRecs({
	orderBy: [{ journal: { tranNumber: SortOrder.Asc } }, { id: SortOrder.Asc }]
});
</script>

<template>
	<div>
		<div v-if="!pending && jeData.length>0">
			<ClientOnly>
				<FusionEntryBase :is-loading="pending" :entry-data="jeData" />
			</ClientOnly>
		</div>
		<DisplaySpinner v-else />

		<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
			<div>status: {{ String(pending) }}</div>

			<div>
				data:
				<pre>{{ jeData }}</pre>
			</div>
		</UPageGrid>
	</div>
</template>
