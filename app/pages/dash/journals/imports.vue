<script lang="ts" setup>
import { CreateJournalImportJobDocument, SourceType, type CreateJournalImportJobMutation, type CreateJournalImportJobMutationVariables, type JournalCreateInput } from '~/generated/graphql';

const { request } = useGql();
const toast = useToast();

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
const strHeaderData = ref<TImportCreateJournalSchema[]>([]);
const submitJournalData = ref<JournalCreateInput[]>([]);
const lineData = ref<TEntryImportJournalLineSchema[]>([]);

const handleImportedData = async (data: IMappedRow[]) => {
	isLoading.value = true;
	uploadError.value = '';
	flatJournalData.value = [];
	strHeaderData.value = [];
	lineData.value = [];
	submitJournalData.value = [];
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

	if (flatJournalData.value.length > 0) {
		const headerArrSchema = ImportCreateJournalSchema.array();
		const lineArrSchema = EntryImportJournalLineSchema.array();

		const parsedHeaders = await headerArrSchema.parseAsync(flatJournalData.value);
		const parsedLines = await lineArrSchema.parseAsync(flatJournalData.value);
		lineData.value = parsedLines;

		const dedupedStr = dedupeAllPropsStable(parsedHeaders);
		strHeaderData.value = dedupedStr;

		for await (const h of dedupedStr) {
			const entries = parsedLines.filter((l) => l.externalId === h.externalId).map(({ externalId: _ext, ...l }) => l);

			submitJournalData.value.push({
				...h,
				tranSource: SourceType.Import,
				entries
			});
		}

		await submitImportJournalJob(submitJournalData.value);
	}

	isLoading.value = false;
};

const submitImportJournalJob = async (input: JournalCreateInput[]) => {
	try {
		const res = await request<CreateJournalImportJobMutation, CreateJournalImportJobMutationVariables>(CreateJournalImportJobDocument, { input });
		console.log(`submitImportJournalJob res: ${JSON.stringify(res, null, 2)}`);
		toast.add({
			title: 'Submitted Job',
			description: `Submitted job ${res.addJournalImportJob.id} with ${res.addJournalImportJob.recordCount} records`
		});
	} catch (e) {
		console.error(`submitImportJournalJob`, e);
	}
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
				<div>flatJournalData: {{ flatJournalData.length }}</div>
				<pre>{{ flatJournalData }}</pre>
			</div>
			<!-- <div v-if="flatJournalData.length>0">
				<div>d: {{ d.length }}</div>
				<pre>{{ d }}</pre>
			</div> -->
			<div v-if="flatJournalData.length>0">
				<div>lineData: {{ lineData.length }}</div>
				<pre>{{ lineData }}</pre>
			</div>
			<div v-if="flatJournalData.length>0">
				<div>submitJournalData: {{ submitJournalData.length }}</div>
				<pre>{{ submitJournalData }}</pre>
			</div>
			<div v-if="flatJournalData.length>0">
				<div>strHeaderData: {{ strHeaderData.length }}</div>
				<pre>{{ strHeaderData }}</pre>
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
