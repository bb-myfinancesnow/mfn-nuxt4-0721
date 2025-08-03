<script lang="ts" setup>
const route = useRoute();

const { getJournalPageRecord } = useJournals();

if (!route.params.id) {
	console.log(`must provide id`);
}

const {
	data: tranData,
	pending
} = await getJournalPageRecord({
	where: {
		id: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
	}
});

const mainDescription = computed<string>(() => {
	if (tranData.value) {
		return `View Detail for Tran ${tranData.value.id}`;
	} else {
		return `Tran Detail is Null`;
	}
});

const periodDescription = computed<string>(() => {
	if (tranData.value) {
		return `View Detail for Tran in Period ${tranData.value.postingPeriod.label}`;
	} else {
		return `Tran Detail is Null`;
	}
});

const infoDescription = computed<string>(() => {
	if (tranData.value) {
		return `View Detail for Tran #${tranData.value.tranNumber}`;
	} else {
		return `Tran Detail is Null`;
	}
});
</script>

<template>
	<div>
		<DisplaySpinner v-if="!tranData || pending" />
		<UPageGrid v-else class="grid-cols-3 gap-4">
			<UPageCard title="Main" :description="mainDescription">
				<div class="grid grid-cols-2">
					<div class="place-self-start font-bold">
						Tran Number
					</div>
					<div class="place-self-end">
						{{ tranData.tranNumber }}
					</div>
					<div class="place-self-start font-bold">
						Tran Date
					</div>
					<div class="place-self-end">
						{{ formatUSDate(tranData.tranDate) }}
					</div>
					<div class="place-self-start font-bold">
						Tran ID
					</div>
					<div class="place-self-end">
						{{ tranData.id }}
					</div>
					<div class="place-self-start font-bold">
						Tran Source
					</div>
					<div class="place-self-end">
						<TableSourceTypeCol :input="tranData.tranSource" />
					</div>
				</div>
			</UPageCard>
			<UPageCard title="Period" :description="periodDescription">
				<div class="grid grid-cols-2">
					<div class="place-self-start font-bold">
						Posting Period
					</div>
					<div class="justify-self-end">
						{{ tranData.postingPeriod.label }}
					</div>
					<div class="place-self-start font-bold">
						Period Locked
					</div>
					<div class="justify-self-end">
						<DisplayBoolBadge :val="tranData.postingPeriod.locked" />
					</div>
					<div class="place-self-start font-bold">
						Posting Period ID
					</div>
					<div class="justify-self-end">
						{{ tranData.postingPeriod.id }}
					</div>
				</div>
			</UPageCard>
			<UPageCard title="Info" :description="infoDescription">
				<div class="grid grid-cols-2">
					<div class="place-self-start font-bold">
						Test
					</div>
					<div class="place-self-end">
						Test val
					</div>
					<div class="place-self-start font-bold">
						Tran Source
					</div>

					<div class="justify-self-end">
						<TableSourceTypeCol :input="tranData.tranSource" />
					</div>
				</div>
			</UPageCard>
		</UPageGrid>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				tranData:
				<pre>{{ tranData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
