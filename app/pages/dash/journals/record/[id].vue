<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';

const route = useRoute();

const { getJournalPageRecord } = useJournals();
const toast = useToast();
const confirm = useConfirm();

const isLoading = ref(false);

if (!route.params.id) {
	console.log(`must provide id`);
}

const { data: tranData, pending } = await getJournalPageRecord({
	where: {
		id: Array.isArray(route.params.id)
			? route.params.id[0]
			: route.params.id
	}
});

const headerTitle = computed<string>(() => {
	if (tranData.value) {
		return `Journal #${tranData.value.tranNumber}`;
	} else {
		return 'Journal #';
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

const items = ref<TabsItem[]>([
	{
		label: 'Account',
		icon: 'i-lucide-user',
		content: 'This is the account content.'
	},
	{
		label: 'Entries',
		icon: 'i-lucide-list',
		slot: 'tableentries' as const
	},
	{
		label: 'Entries Raw',
		icon: 'i-lucide-align-justify',
		slot: 'rawentries' as const
	},
	{
		label: 'System Info',
		icon: 'i-lucide-info',
		slot: 'systeminfo' as const
	}
]);

const deleteTooltipText = computed<string>(() => {
	if (tranData.value) {
		if (tranData.value.postingPeriod.locked) {
			return `Cannot Delete in Locked Period`;
		} else if (tranData.value.reversalOf) {
			return `Cannot Delete Reversal of Journal #${tranData.value.reversalOf.tranNumber}`;
		} else {
			return `Delete Journal`;
		}
	} else {
		return `Loading Data`;
	}
});

const editTooltipText = computed<string>(() => {
	if (tranData.value) {
		if (tranData.value.postingPeriod.locked) {
			return `Cannot Edit in Locked Period`;
		} else if (tranData.value.reversalOf) {
			return `Cannot Edit Reversal of Journal #${tranData.value.reversalOf.tranNumber}`;
		} else {
			return `Edit Journal`;
		}
	} else {
		return `Loading Data`;
	}
});

const deleteConfirmDialog = () => {
	confirm.require({
		message: `Are you sure you want to delete this journal?`,
		header: 'Confirm Delete',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true
		},
		acceptProps: {
			label: 'Save'
		},
		accept: () => {
			toast.add({
				title: 'Confirmed',
				description: 'Confirm Delete',
				color: 'error',
				duration: 5000
			});
		},
		reject: () => {
			toast.add({
				title: 'Rejected',
				description: 'Reject Delete',
				color: 'info',
				duration: 5000
			});
		}
	});
};
</script>

<template>
	<div>
		<DisplaySpinner v-if="!tranData || pending" />
		<UPageGrid
			v-else
			class="grid-cols-3 gap-4"
		>
			<PConfirmDialog />
			<UPageCard
				:title="headerTitle"
				class="col-span-3 mb-4"
			>
				<UButtonGroup
					size="xl"
					class="w-fit ms-auto align-top -mt-10"
				>
					<UTooltip :text="editTooltipText">
						<UButton
							icon="i-lucide-pencil-line"
							color="info"
							:disabled="
								pending
									|| isLoading
									|| editTooltipText !== 'Edit Journal'
							"
							:loading="pending || isLoading"
						/>
					</UTooltip>

					<UTooltip :text="deleteTooltipText">
						<UButton
							icon="i-lucide-trash-2"
							color="error"
							:disabled="
								pending
									|| isLoading
									|| deleteTooltipText !== 'Delete Journal'
							"
							:loading="pending || isLoading"
							@click="() => deleteConfirmDialog()"
						/>
					</UTooltip>
				</UButtonGroup>
			</UPageCard>
			<UPageCard
				title="Main"
				:description="mainDescription"
			>
				<div class="grid grid-cols-2 gap-y-3">
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
			<UPageCard
				title="Period"
				:description="periodDescription"
			>
				<div class="grid grid-cols-2 gap-y-3">
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
						<DisplayBoolBadge
							:val="tranData.postingPeriod.locked"
						/>
					</div>
					<div class="place-self-start font-bold">
						Posting Period ID
					</div>
					<div class="justify-self-end">
						{{ tranData.postingPeriod.id }}
					</div>
				</div>
			</UPageCard>
			<UPageCard
				title="Info"
				:description="infoDescription"
			>
				<div class="grid grid-cols-2 gap-y-3">
					<div class="place-self-start font-bold">
						Test
					</div>
					<div class="place-self-end">
						Test val
					</div>
					<div class="place-self-start font-bold">
						Tran External ID
					</div>
					<div class="place-self-end">
						{{ tranData.externalId }}
					</div>
					<div
						v-if="tranData.createdFromTillerTranId"
						class="place-self-start font-bold"
					>
						Created From Tiller Id
					</div>
					<div
						v-if="tranData.createdFromTillerTranId"
						class="place-self-end"
					>
						{{ tranData.createdFromTillerTranId }}
					</div>
					<!-- <div class="place-self-start font-bold">
						Tran Source
					</div>

					<div class="justify-self-end">
						<TableSourceTypeCol :input="tranData.tranSource" />
					</div> -->
				</div>
			</UPageCard>
		</UPageGrid>
		<DisplaySpinner v-if="!tranData || pending" />
		<UTabs
			v-else
			:items="items"
			class="w-full"
		>
			<template #systeminfo>
				<DisplayStringIdSysInfo
					:string-id="tranData.id"
					:created-at="tranData.createdAt"
					:updated-at="tranData.updatedAt"
				/>
			</template>
			<template #rawentries>
				<div>
					tranData:
					<pre>{{ tranData.entries }}</pre>
				</div>
			</template>
			<template #tableentries>
				<JournalsEntryDetailTable
					:is-loading="pending"
					:je-recs="tranData.entries"
				/>
			</template>
		</UTabs>
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				tranData:
				<pre>{{ tranData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
