<script lang="ts" setup>
interface Props {
	entries: TJournalLineRecSchema[];
}

const props = defineProps<Props>();

const getEntryValSum = (): string => {
	const formattedEntries = props.entries.map(({ amount, isDebit }) => isDebit ? amount : -1 * amount);

	const summed = sumArray(formattedEntries);

	return formatIntAccountingCurrency(summed);
};
</script>

<template>
	<PDataTable
		:value="entries"
		scrollable
		scroll-height="flex"
		resizable-columns
	>
		<PColumn
			field="id"
			header="ID"
			data-type="numeric"
			style="width: 5rem"
			frozen
		/>
		<PColumn
			field="glAccount.accountLabel"
			header="GL Account"
			data-type="text"
			style="width: 15rem"
			frozen
		/>
		<PColumn
			field="amount"
			header="Amount"
			data-type="numeric"
			style="width: 10%; min-width: 8rem; text-align:center"
			body-style="text-align:center"
			frozen
		>
			<template #body="{ data }">
				<TableCurrencyCol
					:input="data.amount"
					:negative-multi="!data.isDebit"
				/>
			</template>
			<template #footer>
				<span class="font-bold">Total: {{ getEntryValSum() }}</span>
			</template>
		</PColumn>
		<PColumn
			field="isDebit"
			header="Debit"
			data-type="boolean"
			style="width: 5rem; text-align:center"
		>
			<template #body="{ data }">
				<TableBoolCol :input="data.isDebit" />
			</template>
		</PColumn>
		<PColumn
			field="memo"
			header="Memo"
			data-type="text"
			style="min-width: 200px"
		/>
	</PDataTable>
</template>
