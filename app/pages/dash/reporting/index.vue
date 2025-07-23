<script setup lang="ts">
const reportData = useReportData();

const { data: periodData, pending } = await reportData.searchPeriods();
</script>

<template>
	<div>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ periodData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
