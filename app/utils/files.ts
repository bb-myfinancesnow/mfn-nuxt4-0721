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
