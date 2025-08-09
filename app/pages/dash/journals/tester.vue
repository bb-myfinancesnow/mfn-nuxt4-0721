<script lang="ts" setup>
const customFields: ITargetField[] = [
	{ key: 'firstName', label: 'First Name', type: 'string', required: true },
	{ key: 'lastName', label: 'Last Name', type: 'string', required: true },
	{ key: 'email', label: 'Email', type: 'email', required: true }
	// ... more fields
];

const handleImportedData = (data: IMappedRow[]) => {
	console.log('Imported data:', data);
	// Process the imported data as needed
};
</script>

<template>
	<div>
		<ImportCsvImporter
			:target-fields="customFields"
			@import="handleImportedData"
		/>
	</div>
</template>
