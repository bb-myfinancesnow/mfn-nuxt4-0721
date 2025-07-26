<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
// const toast = useToast();

const reportData = useReportData();

const {
	data: periodData,
	pending,
	refresh: refreshPeriodQuery
} = await reportData.searchPeriods();

const items: TabsItem[] = [
	{
		label: 'Flat',
		icon: 'i-lucide-rows-3',
		slot: 'flat' as const
	},
	{
		label: 'Tree',
		icon: 'i-lucide-folder-tree',
		slot: 'tree' as const
	}
];
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
			<UTabs :items="items" class="w-full">
				<template #flat>
					<PeriodsFlatTable :is-loading="pending" :period-data="periodData" />
				</template>
				<template #tree>
					<PeriodsTreeView :is-loading="pending" :period-data="periodData" />
				</template>
			</UTabs>
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
