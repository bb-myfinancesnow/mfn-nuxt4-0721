<script lang="ts" setup>
// const customFields: ITargetField[] = [
// 	{ key: 'firstName', label: 'First Name', type: 'string', required: true, description: 'The person\'s first name' },
// 	{ key: 'lastName', label: 'Last Name', type: 'string', required: true },
// 	{ key: 'email', label: 'Email', type: 'email', required: true, description: 'Valid email address' }
// ];
const isLoading = ref(false);

const journalImportFields: ITargetField[] = [
	{ key: 'externalId', label: 'External ID', type: 'string', required: true },
	{ key: 'tranDate', label: 'Tran Date', type: 'date', required: true },
	{ key: 'description', label: 'Description', type: 'string', required: true },
	{ key: 'bookId', label: 'Book ID', type: 'number', required: false },
	{ key: 'reversalDate', label: 'Reversal Date', type: 'date', required: false },
	{ key: 'glAccountNumber', label: 'Gl Account Number', type: 'number', required: true },
	{ key: 'memo', label: 'Memo', type: 'string', required: true },
	{ key: 'amount', label: 'Amount', type: 'number', required: true },
	{ key: 'isDebit', label: 'Is Debit', type: 'boolean', required: true },
	{ key: 'entityId', label: 'Entity ID', type: 'number', required: false }

];

const uploadError = ref('');
const flatJournalData = ref<TFlatImportCreateJournalSchema[]>([]);

const handleImportedData = async (data: IMappedRow[]) => {
	isLoading.value = true;
	uploadError.value = '';
	flatJournalData.value = [];
	console.log('Imported data:', data);
	await new Promise((r) => setTimeout(r, 3000));
	// Process the imported data as needed

	try {
		const parsedFlat = await parseJournalFlatData(data);
		flatJournalData.value = parsedFlat;
	} catch (e) {
		if (e instanceof Error) {
			uploadError.value = e.message;
		}
	}

	isLoading.value = false;
};
</script>

<template>
	<div>
		<DisplaySpinner v-if="isLoading" />
		<ImportCsvWizard
			:is-parent-loading="isLoading"
			:target-fields="journalImportFields"
			@import="handleImportedData"
		/>
		<div class="flex flex-row justify-between">
			<div v-if="flatJournalData.length>0">
				<pre>{{ flatJournalData }}</pre>
			</div>
			<div
				v-if="uploadError"
				class="bg-red-50 border border-red-200 rounded-md p-4"
			>
				<p class="text-red-700">
					{{ uploadError }}
				</p>
			</div>
		</div>
	</div>
</template>
