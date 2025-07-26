<script setup lang="ts">
// const toast = useToast();

const reportData = useReportData();

const {
	data: periodData,
	pending,
	refresh: refreshPeriodQuery
} = await reportData.searchPeriods();
</script>

<template>
	<div>
		<UPageCard title="Period Home">
			<div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
				<UTooltip text="Refresh Periods">
					<UButton
						icon="i-lucide-rotate-ccw-key"
						class="rounded-full"
						size="lg"
						:loading="pending"
						@click="refreshPeriodQuery()"
					/>
				</UTooltip>
			</div>
			<PeriodsTreeView :is-loading="pending" :period-data="periodData" />
		</UPageCard>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ periodData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
