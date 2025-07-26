<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const reportData = useReportData();

const {
	data: jeRaw,
	pending
} = await reportData.searchReportJournals({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});
</script>

<template>
	<div>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ jeRaw }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
