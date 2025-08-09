<script lang="ts" setup>
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

// State
const currentStep = ref(1);
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
		currentStep.value = 2;
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
	currentStep.value = 1;
	csvData.value = [];
	csvHeaders.value = [];
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	Object.keys(fieldMappings).forEach((key) => delete fieldMappings[key]);
	uploadError.value = '';
	importSuccess.value = false;
	isImporting.value = false;
};

const getValidKey = (value: string | number | boolean | null | undefined): string | undefined => {
	// Ensure the key is either a string or undefined (avoiding null)
	if (value === null || value === undefined) {
		return undefined;
	}
	return String(value); // Convert other types to string
};
</script>

<template>
	<div class="csv-importer">
		<div class="max-w-4xl mx-auto p-6 space-y-6">
			<h2 class="text-2xl font-bold text-gray-900">
				CSV Importer
			</h2>

			<!-- Step 1: File Upload -->
			<div v-if="currentStep === 1" class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-700">
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
							class="mx-auto h-12 w-12 text-gray-400"
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
							<p class="text-lg font-medium text-gray-900">
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

			<!-- Step 2: Field Mapping -->
			<div v-if="currentStep === 2" class="space-y-6">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-700">
						Step 2: Map CSV Fields
					</h3>
					<button
						class="text-sm text-blue-600 hover:text-blue-500"
						@click="currentStep = 1"
					>
						← Back to Upload
					</button>
				</div>

				<div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
					<p class="text-yellow-800 text-sm">
						Map your CSV columns to the expected fields. Unmapped columns will be ignored.
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- CSV Columns -->
					<div class="space-y-4">
						<h4 class="font-medium text-gray-900">
							CSV Columns ({{ csvHeaders.length }})
						</h4>
						<div class="bg-gray-50 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto">
							<div
								v-for="(header, index) in csvHeaders"
								:key="index"
								class="bg-white rounded px-3 py-2 border text-sm"
							>
								<div class="flex items-center justify-between">
									<span class="font-medium">{{ header }}</span>
									<span class="text-xs text-gray-500">
										{{ getSampleValue(header) || 'No data' }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Target Fields -->
					<div class="space-y-4">
						<h4 class="font-medium text-gray-900">
							Target Fields
						</h4>
						<div class="space-y-3">
							<div
								v-for="field in targetFields"
								:key="field.key"
								class="bg-white border rounded-lg p-4"
							>
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<label class="font-medium text-gray-700">
											{{ field.label }}
											<span v-if="field.required" class="text-red-500">*</span>
										</label>
										<span class="text-xs text-gray-500">{{ field.type }}</span>
									</div>

									<select
										v-model="fieldMappings[field.key]"
										class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									>
										<option value="">
											-- Select CSV Column --
										</option>
										<option
											v-for="header in csvHeaders"
											:key="header"
											:value="header"
										>
											{{ header }}
										</option>
									</select>

									<p v-if="field.description" class="text-xs text-gray-500">
										{{ field.description }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Validation Errors -->
				<div v-if="mappingErrors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
					<h5 class="font-medium text-red-800 mb-2">
						Mapping Issues:
					</h5>
					<ul class="list-disc list-inside text-sm text-red-700 space-y-1">
						<li v-for="error in mappingErrors" :key="error">
							{{ error }}
						</li>
					</ul>
				</div>

				<!-- Actions -->
				<div class="flex justify-between">
					<button
						class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
						@click="autoMapFields"
					>
						Auto-map Fields
					</button>

					<button
						:disabled="mappingErrors.length > 0"
						class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						@click="validateAndProceed"
					>
						Preview Data
					</button>
				</div>
			</div>

			<!-- Step 3: Data Preview -->
			<div v-if="currentStep === 3" class="space-y-6">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-700">
						Step 3: Preview & Import
					</h3>
					<div class="space-x-2">
						<button
							class="text-sm text-blue-600 hover:text-blue-500"
							@click="currentStep = 2"
						>
							← Back to Mapping
						</button>
					</div>
				</div>

				<div class="bg-green-50 border border-green-200 rounded-md p-4">
					<p class="text-green-800 text-sm">
						Found {{ mappedData.length }} valid rows. Review the data below and click Import to proceed.
					</p>
				</div>

				<!-- Data Preview Table -->
				<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
					<div class="overflow-x-auto max-h-96">
						<table class="min-w-full divide-y divide-gray-300">
							<thead class="bg-gray-50 sticky top-0">
								<tr>
									<th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
										Row
									</th>
									<th
										v-for="field in targetFields.filter(f => fieldMappings[f.key])"
										:key="field.key"
										class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
									>
										{{ field.label }}
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								<tr
									v-for="(row, index) in mappedData.slice(0, 10)"
									:key="index"
									class="hover:bg-gray-50"
								>
									<td class="px-3 py-2 text-sm text-gray-500">
										{{ index + 1 }}
									</td>
									<td
										v-for="field in targetFields.filter(f => fieldMappings[f.key])"
										:key="field.key"
										class="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
										:title="getValidKey(row[field.key])"
									>
										{{ row[field.key] || '-' }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div v-if="mappedData.length > 10" class="bg-gray-50 px-3 py-2 text-sm text-gray-500 text-center">
						Showing first 10 rows of {{ mappedData.length }} total rows
					</div>
				</div>

				<!-- Import Options -->
				<div class="bg-white border border-gray-200 rounded-lg p-4">
					<h5 class="font-medium text-gray-900 mb-3">
						Import Options
					</h5>
					<div class="space-y-3">
						<label class="flex items-center">
							<input
								v-model="importOptions.skipDuplicates"
								type="checkbox"
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							>
							<span class="ml-2 text-sm text-gray-700">Skip duplicate entries</span>
						</label>

						<label class="flex items-center">
							<input
								v-model="importOptions.validateData"
								type="checkbox"
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							>
							<span class="ml-2 text-sm text-gray-700">Validate data before import</span>
						</label>
					</div>
				</div>

				<!-- Final Import -->
				<div class="flex justify-end space-x-3">
					<button
						class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						@click="resetImporter"
					>
						Cancel
					</button>

					<button
						:disabled="isImporting"
						class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
						@click="performImport"
					>
						<svg
							v-if="isImporting"
							class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						{{ isImporting ? 'Importing...' : 'Import Data' }}
					</button>
				</div>
			</div>

			<!-- Success Message -->
			<div v-if="importSuccess" class="bg-green-50 border border-green-200 rounded-md p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">
							Import Successful!
						</h3>
						<p class="mt-1 text-sm text-green-700">
							Successfully imported {{ mappedData.length }} records.
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
	</div>
</template>
