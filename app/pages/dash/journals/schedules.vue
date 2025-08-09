<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const { searchTranSchedRecords } = useSchedules();

const { data: schedData, pending } = await searchTranSchedRecords({
	orderBy: [{ id: SortOrder.Desc }]
});
</script>

<template>
	<div>
		<ClientOnly>
			<DisplaySpinner v-if="!schedData" />
			<div v-else>
				<JournalsSchedSearchTable
					:is-loading="pending"
					:sched-recs="schedData"
				/>
			</div>
		</ClientOnly>
		<!-- <pre>{{ schedData }}</pre> -->
	</div>
</template>
