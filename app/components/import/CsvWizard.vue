<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { SelectItem, StepperItem, TableColumn } from '@nuxt/ui';

const ImportMapLabelCol = resolveComponent('ImportMapLabelCol');

interface Props {
	targetFields?: ITargetField[];
	isParentLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isParentLoading: false,
	targetFields: () => [
		{
			key: 'name',
			label: 'Full Name',
			type: 'string',
			required: true,
			description: 'The person\'s full name'
		},
		{
			key: 'email',
			label: 'Email Address',
			type: 'email',
			required: true,
			description: 'Valid email address'
		},
		{
			key: 'phone',
			label: 'Phone Number',
			type: 'string',
			required: false,
			description: 'Contact phone number'
		},
		{
			key: 'company',
			label: 'Company',
			type: 'string',
			required: false,
			description: 'Company or organization name'
		},
		{
			key: 'position',
			label: 'Job Title',
			type: 'string',
			required: false,
			description: 'Job title or position'
		},
		{
			key: 'age',
			label: 'Age',
			type: 'number',
			required: false,
			description: 'Age in years'
		},
		{
			key: 'active',
			label: 'Active Status',
			type: 'boolean',
			required: false,
			description: 'Whether the record is active'
		}
	]
});

const toast = useToast();

// Emits
const emit = defineEmits<{
	import: [data: IMappedRow[]];
}>();

const items = [
	{
		title: 'File Upload',
		icon: 'i-lucide-file-up',
		slot: 'fileupload' as const
	},
	{
		title: 'Field Mapping',
		slot: 'fieldmapping' as const
	},
	{
		title: 'Preview & Import',
		slot: 'preview' as const
	},
	{
		title: 'Results',
		slot: 'results' as const
	}
] satisfies StepperItem[];

const stepper = useTemplateRef('stepper');

// State
const isLoading = ref(false);
const currentStep = ref(0);
const isDragging = ref(false);
const uploadError = ref('');
const importOptions = reactive<IImportOptions>({
	skipDuplicates: false,
	validateData: true
});
const isImporting = ref(false);
const importSuccess = ref(false);

const parsedFileData = ref<IParsedCsvFileResult>();
const headerFieldMappings = ref<Record<string, string>>({});

// Computed
const mappingErrors = computed(() => {
	const errors: string[] = [];

	// Check required fields
	props.targetFields.forEach((field) => {
		if (field.required && !headerFieldMappings.value[field.key]) {
			errors.push(`Required field "${field.label}" must be mapped`);
		}
	});

	// Check for duplicate mappings
	const mappedColumns = Object.values(headerFieldMappings.value).filter(
		Boolean
	);
	const duplicates = mappedColumns.filter(
		(col, index) => mappedColumns.indexOf(col) !== index
	);

	duplicates.forEach((col) => {
		errors.push(`Column "${col}" is mapped to multiple fields`);
	});

	return errors;
});

const mappedData = computed(() => {
	if (!parsedFileData.value || !parsedFileData.value.csvData.length)
		return [];

	return parsedFileData.value.csvData.map((row) => {
		const mappedRow: IMappedRow = {};

		Object.entries(headerFieldMappings.value).forEach(
			([fieldKey, csvColumn]) => {
				if (csvColumn && row[csvColumn] !== undefined) {
					const field = props.targetFields.find(
						(f) => f.key === fieldKey
					);
					const value = row[csvColumn];

					// Type conversion based on field type
					// if (field && value !== null && value !== '') {
					// 	switch (field.type) {
					// 		case 'number':
					// 			value = parseFloat(value) || null;
					// 			break;
					// 		case 'boolean':
					// 			value = ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
					// 			break;
					// 		case 'email':
					// 			// Basic email validation
					// 			value = String(value).toLowerCase().trim();
					// 			break;
					// 		default:
					// 			value = String(value).trim();
					// 	}
					// }

					mappedRow[fieldKey] = value;
				}
			}
		);

		return mappedRow;
	});
});

const uploadBannerTitle = computed(() => {
	if (!parsedFileData.value || parsedFileData.value.csvData.length === 0) {
		return `No CSV Data Uploaded`;
	} else {
		return `Uploaded File with ${parsedFileData.value.csvData.length} rows`;
	}
});

const nextButtonLabel = computed<string>(() => {
	switch (currentStep.value) {
		case 0:
			return 'Advance to Mapping';
		case 1:
			return 'Preview Data';
		case 2:
			return 'Submit Import';
		default:
			return 'Next';
	}
});

const prevButtonLabel = computed<string>(() => {
	switch (currentStep.value) {
		case 1:
			return 'Back to Import';
		case 2:
			return 'Return to Mapping';
		default:
			return 'Previous';
	}
});

// Methods
const goNextStep = async () => {
	isLoading.value = true;
	await new Promise((r) => setTimeout(r, 1000));

	if (currentStep.value === 0) {
		if (
			!parsedFileData.value
			|| parsedFileData.value.csvData.length === 0
		) {
			toast.add({
				title: 'Missing CSV File',
				description: 'Cannot Advance without CSV Data',
				icon: 'i-lucide-shield-alert',
				color: 'error',
				duration: 3000
			});
			await new Promise((r) => setTimeout(r, 3000));
		} else if (uploadError.value) {
			toast.add({
				title: 'File Errors',
				description: 'Cannot Advance with Import Errors',
				icon: 'i-lucide-shield-alert',
				color: 'error',
				duration: 3000
			});
			await new Promise((r) => setTimeout(r, 3000));
		} else {
			if (Object.keys(headerFieldMappings.value).length === 0) {
				autoMapFields();
			}
			currentStep.value = 1;
		}
	} else if (currentStep.value === 1) {
		if (mappingErrors.value.length > 0) {
			toast.add({
				title: 'Mapping Errors',
				description: `Cannot advance with ${mappingErrors.value.length} mapping errors`,
				icon: 'i-lucide-shield-alert',
				color: 'error',
				duration: 3000
			});
			await new Promise((r) => setTimeout(r, 3000));
		} else {
			currentStep.value = 2;
		}
	} else if (currentStep.value === 2) {
		currentStep.value = 3;
		await performImport();
	}
	isLoading.value = false;
};

const onDrop = (event: DragEvent) => {
	event.preventDefault();
	isDragging.value = false;

	const files = event.dataTransfer?.files;
	if (files && files[0]) {
		handleFileChange(files[0]);
	}
};

const onFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		handleFileChange(target.files[0]);
	}
};

const handleFileChange = async (file: File) => {
	isLoading.value = true;
	headerFieldMappings.value = {};
	uploadError.value = '';
	parsedFileData.value = undefined;

	if (!file.name.toLowerCase().endsWith('.csv')) {
		uploadError.value = 'Please select a CSV file';
		isLoading.value = false;
		return;
	}

	if (file.size > 30 * 1024 * 1024) {
		uploadError.value = 'File size must be less than 30MB';
		isLoading.value = false;
		return;
	}

	try {
		const res = await parseCsvFileData(file);

		if (res.csvHeaders.length === 0) {
			throw new Error(`File Missing Headers`);
		}
		if (res.csvData.length === 0) {
			throw new Error('Empty CSV file');
		}
		uploadError.value = '';
		parsedFileData.value = res;
	} catch (err) {
		console.error(`handleFileChange error`, err);
		uploadError.value = `Failed to parse CSV: ${err instanceof Error ? err.message : 'Unknown error'}`;
	} finally {
		isLoading.value = false;
	}
};

const getSampleValue = (header: string) => {
	const sampleRow = parsedFileData.value?.csvData[0];

	if (!sampleRow) {
		return '';
	} else {
		const val = sampleRow[header];

		if (typeof val === 'boolean') return String(val);
		else if (typeof val === 'number') return val;
		else {
			return String(val).substring(0, 20);
		}
	}

	// return sampleRow ? String(sampleRow[header] || '').substring(0, 20) : '';
};

const autoMapFields = () => {
	props.targetFields.forEach((field) => {
		// Try to find exact match first
		let matchingHeader = parsedFileData.value?.csvHeaders.find(
			(header) =>
				header.toLowerCase() === field.key.toLowerCase()
				|| header.toLowerCase() === field.label.toLowerCase()
		);

		// Try partial matches
		if (!matchingHeader) {
			matchingHeader = parsedFileData.value?.csvHeaders.find(
				(header) =>
					header.toLowerCase().includes(field.key.toLowerCase())
					|| field.key.toLowerCase().includes(header.toLowerCase())
			);
		}

		if (matchingHeader) {
			headerFieldMappings.value[field.key] = matchingHeader;
		}
	});
};

const resetFieldMaps = () => {
	headerFieldMappings.value = {};
};

const performImport = async () => {
	isImporting.value = true;

	try {
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		emit('import', mappedData.value);
		importSuccess.value = true;
		// currentStep.value = 4;
	} catch (error) {
		console.error(`performImport error`, error);
		uploadError.value = 'Import failed. Please try again.';
	} finally {
		isImporting.value = false;
	}
};

const resetImporter = () => {
	isLoading.value = true;
	currentStep.value = 0;
	// csvData.value = [];
	// csvHeaders.value = [];
	// Object.keys(fieldMappings).forEach((key) => delete fieldMappings[key]);
	headerFieldMappings.value = {};
	parsedFileData.value = undefined;
	uploadError.value = '';
	importSuccess.value = false;
	isImporting.value = false;
	isLoading.value = false;
};

const mappingCols = ref<TableColumn<ITargetField>[]>([
	{
		accessorKey: 'label',
		header: 'Label',
		cell: ({ row }) => {
			return h(ImportMapLabelCol, { field: row.original });
		}
	},
	{
		accessorKey: 'key',
		header: 'Field'
	},
	{
		accessorKey: 'type',
		header: 'Type'
	},
	{
		id: 'mapping',
		header: 'Mapping'
	}
]);

const fieldMapColOptions = computed<SelectItem[]>(() => {
	// const opts: SelectItem[] = [{
	// 	label: '-- Select CSV Column --',
	// 	value: undefined
	// }];
	const opts: SelectItem[] = [];

	if (parsedFileData.value && parsedFileData.value.csvHeaders.length) {
		const headerOpts: SelectItem[] = parsedFileData.value.csvHeaders.map(
			(header) => ({
				label: header,
				value: header
			})
		);

		opts.push(...headerOpts);
	}

	return opts;
});
</script>

<template>
	<div class="w-full pt-2 pb-8 space-y-6 px-2">
		<div class="flex flex-row justify-between">
			<h2 class="text-2xl font-bold">
				CSV Import Wizard
			</h2>
			<UButton
				label="Reset"
				color="error"
				icon="i-lucide-eraser"
				:disabled="
					isDragging || isImporting || isLoading || isParentLoading
				"
				:loading="isImporting || isLoading || isParentLoading"
				@click="resetImporter"
			/>
		</div>

		<USeparator
			color="primary"
			type="solid"
		/>
		<UPageCard
			variant="subtle"
			:ui="{ body: 'w-full py-2', footer: 'w-full mt-4 mb-1 border-t-4' }"
		>
			<template #body>
				<UStepper
					ref="stepper"
					v-model="currentStep"
					disabled
					:items="items"
					:ui="{
						header: 'border-2 rounded-2xl py-3 w-full mb-2'
					}"
				>
					<template #fileupload>
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">
								Step 1: Upload CSV File
							</h3>

							<div
								v-if="
									!parsedFileData
										|| parsedFileData.csvData.length === 0
								"
								class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
								:class="{
									'border-blue-400 bg-blue-50': isDragging
								}"
								@drop="onDrop"
								@dragover.prevent
								@dragenter.prevent
							>
								<div class="space-y-4">
									<svg
										class="mx-auto h-12 w-12"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<div>
										<p class="text-lg font-medium">
											Drop your CSV file here, or
											<label
												class="text-blue-600 hover:text-blue-500 cursor-pointer"
											>
												browse
												<input
													type="file"
													class="sr-only"
													accept=".csv,.txt"
													:disabled="
														isDragging
															|| isImporting
															|| isLoading
															|| isParentLoading
													"
													@change="onFileSelect"
												>
											</label>
										</p>
										<p class="text-sm text-gray-500">
											CSV files up to 30MB
										</p>
									</div>
								</div>
							</div>
							<UBanner
								v-else
								color="neutral"
								icon="i-lucide-info"
								:title="uploadBannerTitle"
							/>
							<div
								v-if="uploadError"
								class="bg-red-50 border border-red-200 rounded-md p-4"
							>
								<p class="text-red-700">
									{{ uploadError }}
								</p>
							</div>
						</div>
					</template>
					<template #fieldmapping>
						<div class="space-y-6">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold">
									Step 2: Map CSV Fields
								</h3>
							</div>
							<div
								class="flex flex-row justify-between content-stretch items-center bg-yellow-50 border border-yellow-200 rounded-md p-4 mx-4"
							>
								<p class="text-yellow-800 text-sm">
									Map your CSV columns to the expected fields.
									Unmapped columns will be ignored.
								</p>
								<div
									class="flex flex-row justify-evenly space-x-2"
								>
									<UButton
										label="Auto Map Fields"
										color="neutral"
										variant="soft"
										:disabled="
											isDragging
												|| isImporting
												|| isLoading
												|| isParentLoading
										"
										:loading="
											isImporting
												|| isLoading
												|| isParentLoading
										"
										@click="autoMapFields"
									/>
									<UButton
										label="Reset Mapping"
										color="error"
										variant="outline"
										:disabled="
											isDragging
												|| isImporting
												|| isLoading
												|| isParentLoading
										"
										:loading="
											isImporting
												|| isLoading
												|| isParentLoading
										"
										@click="resetFieldMaps"
									/>
								</div>
							</div>

							<div
								v-if="parsedFileData"
								class="grid grid-cols-4 gap-6 border rounded-lg p-2 divide-x divide-gray-300"
							>
								<!-- CSV Columns -->
								<div class="space-y-4 col-span-1">
									<h4 class="font-medium">
										CSV Columns ({{
											parsedFileData.csvHeaders.length
										}})
									</h4>
									<div
										class="rounded-lg p-4 space-y-2 max-h-full overflow-y-auto"
									>
										<div
											v-for="(
												header, index
											) in parsedFileData.csvHeaders"
											:key="index"
											class="rounded px-3 py-2 border text-sm"
										>
											<div
												class="flex items-center justify-between"
											>
												<span class="font-medium">{{
													header
												}}</span>
												<span class="text-xs">
													{{
														getSampleValue(
															header
														) || 'No data'
													}}
												</span>
											</div>
										</div>
									</div>
								</div>

								<!-- Target Fields Table -->
								<div class="space-y-4 col-span-3">
									<h4 class="font-medium">
										Target Fields
									</h4>
									<UTable
										:data="targetFields"
										:columns="mappingCols"
									>
										<template #mapping-cell="{ row }">
											<!-- <div>{{ fieldMappings[row.original.key] }}</div> -->
											<USelect
												v-model="
													headerFieldMappings[
														row.original.key
													]
												"
												:items="fieldMapColOptions"
												placeholder="-- Select CSV Column --"
												:ui="{ content: 'min-w-fit' }"
												:disabled="
													isDragging
														|| isImporting
														|| isLoading
														|| isParentLoading
												"
												:loading="
													isImporting
														|| isLoading
														|| isParentLoading
												"
												class="w-full"
											/>
										</template>
									</UTable>
								</div>
							</div>
							<!-- Validation Errors -->
							<div
								v-if="mappingErrors.length > 0"
								class="bg-red-50 border border-red-200 rounded-md p-4"
							>
								<h5 class="font-medium text-red-800 mb-2">
									Mapping Issues:
								</h5>
								<ul
									class="list-disc list-inside text-sm text-red-700 space-y-1"
								>
									<li
										v-for="error in mappingErrors"
										:key="error"
									>
										{{ error }}
									</li>
								</ul>
							</div>
						</div>
					</template>
					<template #preview>
						<div class="space-y-6">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold">
									Step 3: Preview & Import
								</h3>
							</div>

							<div
								class="bg-green-50 border border-green-200 rounded-md p-4"
							>
								<p class="text-green-800 text-sm">
									Found {{ mappedData.length }} valid rows.
									Review the data below and click Import to
									proceed.
								</p>
							</div>

							<!-- Import Options -->
							<div class="border-gray-200 rounded-lg p-4">
								<h5 class="font-medium mb-3">
									Import Options
								</h5>
								<div class="space-y-3">
									<label class="flex items-center">
										<input
											v-model="
												importOptions.skipDuplicates
											"
											type="checkbox"
											class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											:disabled="
												isDragging
													|| isImporting
													|| isLoading
													|| isParentLoading
											"
										>
										<span class="ml-2 text-sm">Skip duplicate entries</span>
									</label>

									<label class="flex items-center">
										<input
											v-model="importOptions.validateData"
											type="checkbox"
											class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											:disabled="
												isDragging
													|| isImporting
													|| isLoading
													|| isParentLoading
											"
										>
										<span class="ml-2 text-sm">Validate data before import</span>
									</label>
								</div>
							</div>

							<!-- Data Preview Table -->
							<div
								class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
							>
								<div class="overflow-x-auto max-h-96">
									<UTable :data="mappedData" />
								</div>
							</div>
						</div>
					</template>

					<template #results>
						<div>
							<!-- Success Message -->
							<div
								v-if="importSuccess"
								class="bg-green-50 border border-green-200 rounded-md p-4"
							>
								<div class="flex">
									<svg
										class="h-5 w-5 text-green-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<div class="ml-3">
										<h3
											class="text-sm font-medium text-green-800"
										>
											Import Successful!
										</h3>
										<p class="mt-1 text-sm text-green-700">
											Successfully submitted import of
											{{ mappedData.length }} records.
										</p>
										<button
											class="mt-2 text-sm text-green-600 hover:text-green-500 underline"
											@click="resetImporter"
										>
											Import Another File
										</button>
									</div>
								</div>
							</div>
						</div>
					</template>
				</UStepper>
			</template>

			<template #footer>
				<div
					v-if="currentStep !== 3"
					class="flex flex-row justify-center space-x-3"
				>
					<UButton
						v-if="stepper?.hasPrev"
						size="xl"
						leading-icon="i-lucide-arrow-left"
						:label="prevButtonLabel"
						variant="soft"
						:disabled="
							!stepper?.hasPrev
								|| isLoading
								|| isDragging
								|| isImporting
								|| isParentLoading
						"
						:loading="isLoading || isImporting || isParentLoading"
						@click="stepper?.prev()"
					/>

					<UButton
						variant="soft"
						size="xl"
						trailing-icon="i-lucide-arrow-right"
						:disabled="
							!stepper?.hasNext
								|| isLoading
								|| isDragging
								|| isImporting
								|| isParentLoading
						"
						:loading="isLoading || isImporting || isParentLoading"
						:label="nextButtonLabel"
						@click="goNextStep"
					/>
				</div>
			</template>
		</UPageCard>
	</div>
</template>
