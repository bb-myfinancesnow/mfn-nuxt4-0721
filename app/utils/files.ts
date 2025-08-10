import Papa from 'papaparse';

export enum EImportRecordType {
	CreateJournals = 'CreateJournals',
	UpsertJournals = 'UpsertJournals',
	CreateGlAccounts = 'CreateGlAccounts',
	UpsertGlAccounts = 'UpsertGlAccounts'
}

// Types
export interface ITargetField {
	key: string;
	label: string;
	type: 'string' | 'number' | 'email' | 'date' | 'boolean';
	required: boolean;
	description?: string;
}

export interface IImportOptions {
	skipDuplicates: boolean;
	validateData: boolean;
}

export interface IMappedRow {
	[key: string]: string | number | boolean | null;
}

export type TCsvRow = Record<string, string | number | boolean | null>;

export interface IParsedCsvFileResult {
	inputFile: File;
	csvHeaders: string[];
	csvData: TCsvRow[];
}

export const getValidKey = (value: string | number | boolean | null | undefined): string | undefined => {
	// Ensure the key is either a string or undefined (avoiding null)
	if (value === null || value === undefined) {
		return undefined;
	}
	return String(value); // Convert other types to string
};

export const parseCsvFileData = (inputFile: File): Promise<IParsedCsvFileResult> => {
	return new Promise((resolve, reject) => {
		Papa.parse<TCsvRow>(inputFile, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim(), // trim headers
			transform: (value) => {
				if (typeof value === 'string') {
					const trimmed = value.trim();
					return trimmed === '' ? null : trimmed; // empty → null
				}
				return value;
			},
			error: (error) => reject(error),
			complete: (results) => {
				if (results.errors.length) {
					reject(results.errors);
				} else {
					const csvHeaders = results.meta.fields ?? [];

					resolve({
						inputFile,
						csvHeaders,
						csvData: results.data
					});
				}
			}
		});
	});
};
