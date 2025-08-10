<script lang="ts" setup>
// const customFields: ITargetField[] = [
// 	{ key: 'firstName', label: 'First Name', type: 'string', required: true, description: 'The person\'s first name' },
// 	{ key: 'lastName', label: 'Last Name', type: 'string', required: true },
// 	{ key: 'email', label: 'Email', type: 'email', required: true, description: 'Valid email address' }
// ];

const journalImportFields: ITargetField[] = [
	{ key: 'externalId', label: 'External ID', type: 'string', required: true },
	{ key: 'tranDate', label: 'Tran Date', type: 'date', required: true },
	{ key: 'description', label: 'Description', type: 'string', required: true },
	{ key: 'bookId', label: 'Book ID', type: 'number', required: false },
	{ key: 'glAccountNumber', label: 'Gl Account Number', type: 'number', required: true },
	{ key: 'memo', label: 'Memo', type: 'string', required: true },
	{ key: 'amount', label: 'Amount', type: 'number', required: true },
	{ key: 'isDebit', label: 'Is Debit', type: 'boolean', required: true },
	{ key: 'entityId', label: 'Entity ID', type: 'number', required: false }

];

const handleImportedData = (data: IMappedRow[]) => {
	console.log('Imported data:', data);
	// Process the imported data as needed
};
</script>

<template>
	<div>
		<ImportCsvWizard
			:target-fields="journalImportFields"
			@import="handleImportedData"
		/>
	</div>
</template>
