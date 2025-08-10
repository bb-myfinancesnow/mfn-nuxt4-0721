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

// Emits
const emit = defineEmits<{
	import: [data: IMappedRow[]];
}>();

const items = ref<StepperItem[]>([
	{
		title: 'File Upload',
		// description: 'Choose your file here',
		icon: 'i-lucide-file-up',
		slot: 'fileupload' as const
	},
	{
		title: 'Field Mapping'
		// description: 'Map File Columns to Records'
	},
	{
		title: 'Preview & Import'
		// description: 'Confirm your order'
	},
	{
		title: 'Results'
	}
]);

const stepper = useTemplateRef('stepper');

// State
const currentStep = ref(0);
const isDragging = ref(false);
const uploadError = ref('');
const csvData = ref<any[]>([]);
const csvHeaders = ref<string[]>([]);
const fieldMappings = reactive<Record<string, string>>({});
const importOptions = reactive<IImportOptions>({
	skipDuplicates: false,
	validateData: true
});
const isImporting = ref(false);
const importSuccess = ref(false);

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
	if (!csvData.value.length) return [];

	return csvData.value.map((row) => {
		const mappedRow: IMappedRow = {};

		Object.entries(fieldMappings).forEach(([fieldKey, csvColumn]) => {
			if (csvColumn && row[csvColumn] !== undefined) {
				const field = props.targetFields.find((f) => f.key === fieldKey);
				let value = row[csvColumn];

				// Type conversion based on field type
				if (field && value !== null && value !== '') {
					switch (field.type) {
						case 'number':
							value = parseFloat(value) || null;
							break;
						case 'boolean':
							value = ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
							break;
						case 'email':
							// Basic email validation
							value = String(value).toLowerCase().trim();
							break;
						default:
							value = String(value).trim();
					}
				}

				mappedRow[fieldKey] = value;
			}
		});

		return mappedRow;
	});
});

// Methods
const parseCSV = (csvText: string) => {
	try {
		const lines = csvText.split('\n').filter((line) => line.trim());
		if (lines.length === 0 || !lines[0]) throw new Error('Empty CSV file');
		if (lines.length === 1) throw new Error('File Contains Only Header');

		const headers = lines[0].split(',').map((header) => header.trim().replace(/['"]/g, ''));
		csvHeaders.value = headers;

		const data = lines.slice(1).map((line) => {
			const values = line.split(',').map((value) => value.trim().replace(/['"]/g, ''));
			const row: Record<string, string> = {};
			headers.forEach((header, index) => {
				row[header] = values[index] || '';
			});
			return row;
		});

		csvData.value = data;
		currentStep.value = 1;
		uploadError.value = '';
	} catch (error) {
		uploadError.value = `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`;
	}
};

const onDrop = (event: DragEvent) => {
	event.preventDefault();
	isDragging.value = false;

	const files = event.dataTransfer?.files;
	if (files && files[0]) {
		handleFile(files[0]);
	}
};

const onFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		handleFile(target.files[0]);
	}
};

const handleFile = (file: File) => {
	if (!file.name.toLowerCase().endsWith('.csv')) {
		uploadError.value = 'Please select a CSV file';
		return;
	}

	if (file.size > 10 * 1024 * 1024) {
		uploadError.value = 'File size must be less than 10MB';
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const text = e.target?.result as string;
		parseCSV(text);
	};
	reader.onerror = () => {
		uploadError.value = 'Failed to read file';
	};
	reader.readAsText(file);
};

const getSampleValue = (header: string) => {
	const sampleRow = csvData.value[0];
	return sampleRow ? String(sampleRow[header] || '').substring(0, 20) : '';
};

const autoMapFields = () => {
	props.targetFields.forEach((field) => {
		// Try to find exact match first
		let matchingHeader = csvHeaders.value.find((header) =>
			header.toLowerCase() === field.key.toLowerCase()
			|| header.toLowerCase() === field.label.toLowerCase()
		);

		// Try partial matches
		if (!matchingHeader) {
			matchingHeader = csvHeaders.value.find((header) =>
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
	currentStep.value = 0;
	csvData.value = [];
	csvHeaders.value = [];
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	Object.keys(fieldMappings).forEach((key) => delete fieldMappings[key]);
	uploadError.value = '';
	importSuccess.value = false;
	isImporting.value = false;
};
</script>

<template>
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
</template>
