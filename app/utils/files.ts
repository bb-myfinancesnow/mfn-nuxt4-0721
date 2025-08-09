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

export const getValidKey = (value: string | number | boolean | null | undefined): string | undefined => {
	// Ensure the key is either a string or undefined (avoiding null)
	if (value === null || value === undefined) {
		return undefined;
	}
	return String(value); // Convert other types to string
};
