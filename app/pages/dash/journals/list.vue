<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const { searchJournalHeaderDetails } = useJournals();

const {
	data: jeData,
	pending
} = await searchJournalHeaderDetails({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});
</script>

<template>
	<div>
		<JournalsSearchTable :is-loading="pending" :je-recs="jeData" />
	</div>
</template>
