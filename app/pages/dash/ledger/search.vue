<script lang="ts" setup>
import { SortOrder } from '~/generated/graphql';

const ledgerData = useLedger();

const {
	data: jeData,
	pending
} = await ledgerData.searchJournalRecs({
	orderBy: [{ tranDate: SortOrder.Asc }, { tranNumber: SortOrder.Asc }]
});
</script>

<template>
	<UDashboardPanel id="ledgersearch">
		<template #header>
			<UDashboardNavbar
				title="Ledger Search"
				:ui="{ right: 'gap-3' }"
			>
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UColorModeSelect />
				</template>
			</UDashboardNavbar>
		</template>
		<template #body>
			<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
				<div>status: {{ String(pending) }}</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
