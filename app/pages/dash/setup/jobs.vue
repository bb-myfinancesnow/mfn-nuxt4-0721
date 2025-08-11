<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const { searchBulkJobsWithRecs } = useJobs();

const {
	data: jobData,
	pending
} = await searchBulkJobsWithRecs({
	orderBy: [{ id: SortOrder.Asc }]
});
</script>

<template>
	<UPageCard title="Bulk Jobs" class="w-fit">
		<template #body>
			<JobsSearchTable :is-loading="pending" :job-recs="jobData" />
		</template>

		<!-- <div>
			<pre>{{ jobData }}</pre>
		</div> -->
	</UPageCard>
</template>
