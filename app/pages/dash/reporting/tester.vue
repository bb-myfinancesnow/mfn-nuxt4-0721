<script setup lang="ts">
import { AccountTypeClass, SortOrder } from '~/generated/graphql';

const { searchGlEntryRecs } = useLedger();

const {
	data: jeData,
	pending,
	refresh: refreshJournalQuery
} = await searchGlEntryRecs({
	orderBy: [
		{ journal: { tranDate: SortOrder.Asc } },
		{ glAccountNumber: SortOrder.Asc },
		{ id: SortOrder.Asc }
	],
	where: {
		journal: {
			is: {
				postingYear: { equals: 2024 },
				postingMonth: { lte: 3 }
			}
		},
		glAccount: {
			is: {
				accountType: {
					is: {
						class: {
							in: [
								AccountTypeClass.Revenue,
								AccountTypeClass.Expense
							]
						}
					}
				}
			}
		}
	}
});
</script>

<template>
	<div>
		<UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
			<UPageCard class="col-span-3">
				<ClientOnly
					fallback-tag="span"
					fallback="Loading..."
				>
					<PivotsLedgerPivot
						:is-parent-loading="pending"
						:ledger-entries="jeData"
					/>
				</ClientOnly>
			</UPageCard>
			<UPageCard title="Info">
				<template #header>
					<div>status: {{ String(pending) }}</div>
					<UButton
						:loading="pending"
						label="Refresh Query"
						@click="() => refreshJournalQuery()"
					/>
				</template>
			</UPageCard>
			<UPageCard
				title="Raw Data"
				class="col-span-2"
			>
				<div>status: {{ String(pending) }}</div>
				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageCard>
		</UPageGrid>
	</div>
	<!-- <div class="w-full">
		<ClientOnly fallback-tag="span" fallback="Loading...">
			<PivotsMyPivot :data="mockData" />
		</ClientOnly>
	</div> -->
</template>
