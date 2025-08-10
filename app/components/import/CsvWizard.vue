<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import type { StepperItem } from '@nuxt/ui';

interface Props {
	targetFields?: ITargetField[];
}

const props = withDefaults(defineProps<Props>(), {
	targetFields: () => [
		{ key: 'name', label: 'Full Name', type: 'string', required: true, description: 'The person\'s full name' },
		{ key: 'email', label: 'Email Address', type: 'email', required: true, description: 'Valid email address' },
		{ key: 'phone', label: 'Phone Number', type: 'string', required: false, description: 'Contact phone number' },
		{ key: 'company', label: 'Company', type: 'string', required: false, description: 'Company or organization name' },
		{ key: 'position', label: 'Job Title', type: 'string', required: false, description: 'Job title or position' },
		{ key: 'age', label: 'Age', type: 'number', required: false, description: 'Age in years' },
		{ key: 'active', label: 'Active Status', type: 'boolean', required: false, description: 'Whether the record is active' }
	]
});

const toast = useToast();

// Emits
const emit = defineEmits<{
	import: [data: IMappedRow[]];
}>();

// const items = ref<StepperItem[]>([
// 	{
// 		title: 'File Upload',
// 		// description: 'Choose your file here',
// 		icon: 'i-lucide-file-up',
// 		slot: 'fileupload' as const
// 	},
// 	{
// 		title: 'Field Mapping'
// 		// description: 'Map File Columns to Records'
// 	},
// 	{
// 		title: 'Preview & Import'
// 		// description: 'Confirm your order'
// 	},
// 	{
// 		title: 'Results'
// 	}
// ]);

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
// const csvData = ref<any[]>([]);
// const csvHeaders = ref<string[]>([]);
const fieldMappings = reactive<Record<string, string>>({});
const importOptions = reactive<IImportOptions>({
	skipDuplicates: false,
	validateData: true
});
const isImporting = ref(false);
const importSuccess = ref(false);

const parsedFileData = ref<IParsedCsvFileResult>();

// Computed
const mappingErrors = computed(() => {
	const errors: string[] = [];

	// Check required fields
	props.targetFields.forEach((field) => {
		if (field.required && !fieldMappings[field.key]) {
			errors.push(`Required field "${field.label}" must be mapped`);
		}
	});

	// Check for duplicate mappings
	const mappedColumns = Object.values(fieldMappings).filter(Boolean);
	const duplicates = mappedColumns.filter((col, index) =>
		mappedColumns.indexOf(col) !== index
	);

	duplicates.forEach((col) => {
		errors.push(`Column "${col}" is mapped to multiple fields`);
	});

	return errors;
});

const mappedData = computed(() => {
	if (!parsedFileData.value || !parsedFileData.value.csvData.length) return [];

	return parsedFileData.value.csvData.map((row) => {
		const mappedRow: IMappedRow = {};

		Object.entries(fieldMappings).forEach(([fieldKey, csvColumn]) => {
			if (csvColumn && row[csvColumn] !== undefined) {
				const field = props.targetFields.find((f) => f.key === fieldKey);
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
		});

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

// Methods
const goNextStep = async () => {
	isLoading.value = true;
	await new Promise((r) => setTimeout(r, 1000));

	if (currentStep.value === 0) {
		if (!parsedFileData.value || parsedFileData.value.csvData.length === 0) {
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
			currentStep.value = 1;
		}
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
	return sampleRow ? String(sampleRow[header] || '').substring(0, 20) : '';
};

const autoMapFields = () => {
	props.targetFields.forEach((field) => {
		// Try to find exact match first
		let matchingHeader = parsedFileData.value?.csvHeaders.find((header) =>
			header.toLowerCase() === field.key.toLowerCase()
			|| header.toLowerCase() === field.label.toLowerCase()
		);

		// Try partial matches
		if (!matchingHeader) {
			matchingHeader = parsedFileData.value?.csvHeaders.find((header) =>
				header.toLowerCase().includes(field.key.toLowerCase())
				|| field.key.toLowerCase().includes(header.toLowerCase())
			);
		}

		if (matchingHeader) {
			fieldMappings[field.key] = matchingHeader;
		}
	});
};

const validateAndProceed = () => {
	if (mappingErrors.value.length === 0) {
		currentStep.value = 3;
	}
};

const performImport = async () => {
	isImporting.value = true;

	try {
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		emit('import', mappedData.value);
		importSuccess.value = true;
		currentStep.value = 4;
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
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	Object.keys(fieldMappings).forEach((key) => delete fieldMappings[key]);
	parsedFileData.value = undefined;
	uploadError.value = '';
	importSuccess.value = false;
	isImporting.value = false;
	isLoading.value = false;
};
</script>

<template>
	<div class="w-full min-h-screen pt-2 pb-8 space-y-6 px-2">
		<div class="flex flex-row justify-between">
			<h2 class="text-2xl font-bold">
				CSV Import Wizard
			</h2>
			<UButton
				label="Reset"
				color="error"
				icon="i-lucide-eraser"
				:disabled="isDragging||isImporting||isLoading"
				:loading="isImporting||isLoading"
				@click="resetImporter"
			/>
		</div>

		<USeparator color="primary" type="solid" />
		<UPageCard variant="subtle" :ui="{ body: 'w-full py-2', footer: 'w-full mt-4 mb-1 border-t-4' }">
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
								v-if="!parsedFileData||parsedFileData.csvData.length===0"
								class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
								:class="{ 'border-blue-400 bg-blue-50': isDragging }"
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
											<label class="text-blue-600 hover:text-blue-500 cursor-pointer">
												browse
												<input
													type="file"
													class="sr-only"
													accept=".csv,.txt"
													@change="onFileSelect"
												>
											</label>
										</p>
										<p class="text-sm text-gray-500">
											CSV files up to 10MB
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
							<div v-if="uploadError" class="bg-red-50 border border-red-200 rounded-md p-4">
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
						</div>
					</template>
				</UStepper>
			</template>

			<template #footer>
				<div class="flex flex-row justify-center space-x-3">
					<UButton
						v-if="stepper?.hasPrev"
						size="xl"
						leading-icon="i-lucide-arrow-left"
						label="Prev"
						variant="soft"
						:disabled="!stepper?.hasPrev ||isLoading||isDragging||isImporting"
						:loading="isLoading||isImporting"
						@click="stepper?.prev()"
					/>

					<UButton
						variant="soft"
						size="xl"
						trailing-icon="i-lucide-arrow-right"
						:disabled="!stepper?.hasNext||isLoading||isDragging||isImporting"
						:loading="isLoading||isImporting"
						label="Next"
						@click="goNextStep"
					/>
				</div>
			</template>
		</UPageCard>
	</div>
</template>

<!-- <template>
	<div class="w-full min-h-screen pt-2 pb-8 space-y-6 px-2">
		<h2 class="text-2xl font-bold">
			CSV Import Wizard
		</h2>
		<UStepper
			ref="stepper"
			v-model="currentStep"
			disabled
			:items="items"
		>
			<template #fileupload>
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">
						Step 1: Upload CSV File
					</h3>

					<div
						class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
						:class="{ 'border-blue-400 bg-blue-50': isDragging }"
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
									<label class="text-blue-600 hover:text-blue-500 cursor-pointer">
										browse
										<input
											type="file"
											class="sr-only"
											accept=".csv,.txt"
											@change="onFileSelect"
										>
									</label>
								</p>
								<p class="text-sm text-gray-500">
									CSV files up to 10MB
								</p>
							</div>
						</div>
					</div>

					<div v-if="uploadError" class="bg-red-50 border border-red-200 rounded-md p-4">
						<p class="text-red-700">
							{{ uploadError }}
						</p>
					</div>
				</div>
			</template>
		</UStepper>
	</div>
</template> -->
