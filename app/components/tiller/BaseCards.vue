<script lang="ts" setup>
interface ITillerPageCardStat {
	title: string;
	icon: string;
	to?: string;
	value: number | string;
	counterValue?: number;
	counterSuffix?: string;
	counterPrefix?: string;
	formatter?: (value: number) => string;
}

const props = defineProps<{
	homeTillerData: TBaseTillerInfosSchema;
	isLoading: boolean;
}>();

const tillerStatsComputed = computed<ITillerPageCardStat[]>(() => {
	const counterAccCard: ITillerPageCardStat = {
		title: 'Accounts',
		icon: 'i-lucide-notebook-tabs',
		value: props.homeTillerData.tillerAccounts.length,
		counterValue: props.homeTillerData.tillerAccounts.length,
		counterPrefix: 'Total Accounts: ',
		to: '/dash/tiller/accounts'
	};
	const counterCatCard: ITillerPageCardStat = {
		title: 'Categories',
		icon: 'i-lucide-list',
		value: props.homeTillerData.tillerCategories.length,
		counterValue: props.homeTillerData.tillerCategories.length,
		counterPrefix: 'Total Categories: ',
		to: '/dash/tiller/categories'
	};

	// const totalTransCard: ITillerPageCardStat = {
	// 	title: 'Tiller Trans',
	// 	icon: 'i-lucide-banknote-x',
	// 	value: props.homeTillerData.tillerTrans.length,
	// 	counterValue: props.homeTillerData.tillerTrans.length,
	// 	counterPrefix: 'Total Trans: '
	// };

	const unRecTrans = props.homeTillerData.tillerTrans.filter(
		(t) => !t.generatedJournal && !t.reconciled && !t.excluded
	);

	const unRecTransCard: ITillerPageCardStat = {
		title: 'Unreconciled Tiller Trans',
		icon: 'i-lucide-circle-ellipsis',
		value: unRecTrans.length,
		counterValue: unRecTrans.length,
		counterPrefix: 'Unreconciled Count:  '
	};

	const maxDateObj = props.homeTillerData.tillerTrans.reduce((max, current) => {
		return current.date > max.date ? current : max;
	});

	const maxDateAdded = Math.max(...props.homeTillerData.tillerTrans.map((t) => t.dateAdded.getTime()));

	const tranDateCard: ITillerPageCardStat = {
		title: `Created Trans Through ${formatUSDate(maxDateObj.date)} last on ${formatUSDate(new Date(maxDateAdded))}`,
		icon: 'i-lucide-calendar-fold',
		value: props.homeTillerData.tillerTrans.length,
		counterValue: props.homeTillerData.tillerTrans.length,
		counterPrefix: 'Total Trans: '
	};

	return [counterAccCard, counterCatCard, unRecTransCard, tranDateCard];
});

// const { data: tillerStats } = useAsyncData<ITillerPageCardStat[]>(
// 	'tillerstats',
// 	async () => {
// 		const counterAccCard: ITillerPageCardStat = {
// 			title: 'Accounts',
// 			icon: 'i-lucide-notebook-tabs',
// 			value: props.homeTillerData.tillerAccounts.length,
// 			counterValue: props.homeTillerData.tillerAccounts.length,
// 			counterPrefix: 'Total Accounts: ',
// 			to: '/dash/tiller/accounts'
// 		};
// 		const counterCatCard: ITillerPageCardStat = {
// 			title: 'Categories',
// 			icon: 'i-lucide-list',
// 			value: props.homeTillerData.tillerCategories.length,
// 			counterValue: props.homeTillerData.tillerCategories.length,
// 			counterPrefix: 'Total Categories: '
// 		};
// 		// const catCard: ITillerPageCardStat = {
// 		// 	title: 'Categories',
// 		// 	icon: 'i-lucide-list',
// 		// 	value: props.homeTillerData.tillerCategories.length
// 		// };

// 		// const accCard: ITillerPageCardStat = {
// 		// 	title: 'Accounts',
// 		// 	icon: 'i-lucide-notebook-tabs',
// 		// 	value: props.homeTillerData.tillerAccounts.length
// 		// };

// 		const totalTransCard: ITillerPageCardStat = {
// 			title: 'Tiller Trans',
// 			icon: 'i-lucide-banknote-x',
// 			value: props.homeTillerData.tillerTrans.length,
// 			counterValue: props.homeTillerData.tillerTrans.length,
// 			counterPrefix: 'Total Trans: '
// 		};

// 		const unRecTrans = props.homeTillerData.tillerTrans.filter((t) => !t.generatedJournal && !t.reconciled && !t.excluded);

// 		const unRecTransCard: ITillerPageCardStat = {
// 			title: 'Unreconciled Tiller Trans',
// 			icon: 'i-lucide-circle-ellipsis',
// 			value: unRecTrans.length,
// 			counterValue: unRecTrans.length,
// 			counterPrefix: 'Unreconciled Count:  '
// 		};

// 		return [counterAccCard, counterCatCard, totalTransCard, unRecTransCard];
// 	},
// 	{
// 		watch: [() => props.homeTillerData],
// 		default: () => []
// 	}
// );
</script>

<template>
	<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6">
		<DisplaySpinner v-if="isLoading" />
		<UPageCard
			v-for="(stat, index) in tillerStatsComputed"
			v-else
			:key="index"
			:icon="stat.icon"
			:title="stat.title"
			:to="stat.to"
			variant="subtle"
			:ui="{
				container: 'gap-y-1.5',
				wrapper: 'items-start',
				leading:
					'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
				title: 'font-normal text-muted text-xs uppercase'
			}"
			class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
		>
			<div class="flex items-center gap-2">
				<DisplayCountto
					v-if="stat.counterValue || stat.counterValue === 0"
					class="text-2xl font-semibold text-highlighted"
					:end-value="stat.counterValue"
					:prefix="stat.counterPrefix"
					:suffix="stat.counterSuffix"
					:duration="3000"
				/>
				<span
					v-else
					class="text-2xl font-semibold text-highlighted"
				>
					{{ stat.value }}
				</span>
			</div>
		</UPageCard>
	</UPageGrid>
</template>
