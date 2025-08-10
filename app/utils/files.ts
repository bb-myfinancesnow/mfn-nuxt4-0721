import Papa from 'papaparse';
import z from 'zod';

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

export interface IGroupedTargetField extends ITargetField {
	header: boolean;
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

export const getValidKey = (
	value: string | number | boolean | null | undefined
): string | undefined => {
	// Ensure the key is either a string or undefined (avoiding null)
	if (value === null || value === undefined) {
		return undefined;
	}
	return String(value); // Convert other types to string
};

export const parseCsvFileData = (
	inputFile: File
): Promise<IParsedCsvFileResult> => {
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

export const ImportCreateJournalLineSchema = z.object({
	memo: z.string().min(3, {
		message: 'Memo must be at least 3 characters.'
	}),
	glAccountNumber: z.coerce.number().int().min(10000).max(99999),
	amount: z.coerce.number().transform((val) => {
		const inted = val * 100;
		return roundTo(inted, 1);
	}),
	isDebit: z.coerce.boolean(),
	entityId: z.coerce.number().int().optional().nullable()
});

export type TImportCreateJournalLineSchema = z.output<
	typeof ImportCreateJournalLineSchema
>;

export const ImportCreateJournalSchema = z.object({
	externalId: z.string(),
	description: z.string().min(3, {
		message: 'Description must be at least 3 characters.'
	}),
	tranDate: z.coerce.date(),
	reversalDate: z.coerce.date().optional(),
	bookId: z.number().int().optional()
});

export type TImportCreateJournalSchema = z.output<
	typeof ImportCreateJournalSchema
>;

export const FlatImportCreateJournalSchema = ImportCreateJournalSchema.merge(
	ImportCreateJournalLineSchema
);

export type TFlatImportCreateJournalSchema = z.output<
	typeof FlatImportCreateJournalSchema
>;

export const parseJournalFlatData = async (
	inputs: IMappedRow[]
): Promise<TFlatImportCreateJournalSchema[]> => {
	const arrSchema = FlatImportCreateJournalSchema.array();

	const parseRes = await arrSchema.safeParseAsync(inputs);

	if (parseRes.error) {
		const errStrings = zodErrorToStringArray(parseRes.error);
		const errMessages = errStrings.join('\n');
		throw new Error(`Parse Errors: ${errMessages}`);
	} else {
		return parseRes.data;
	}
};
