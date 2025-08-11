import type { ColumnProps } from 'primevue/column';
import type { ColumnModel } from '@syncfusion/ej2-grids';
import { JobStatus, SourceType } from '~/generated/graphql';

export const PrimePageLengthOptions = [5, 10, 25, 50, 100] as const;

export type TPrimePageLengthOption = (typeof PrimePageLengthOptions)[number];

export type TPrimeSelectConfig = 'multiselect' | 'dropdown';

export type TBasePrimeColumnType = 'text' | 'boolean' | 'numeric' | 'date';

export type TPrimeColumnType
	= | 'text'
		| 'stringToUpper'
		| 'boolean'
		| 'numeric'
		| 'integer'
		| 'currency'
		| 'date'
		| 'datetime'
		| 'multiselect'
		| 'dropdown'
		| 'entityTypes'
		| 'accountTypeCategories'
		| 'tranSources'
		| 'jobStatuses';

export interface IPrimeColumnProps extends ColumnProps {
	colId: string;
	filterable: boolean;
	displayLabel: string;
	disableHide?: boolean;
	defaultHidden?: boolean;
}

export interface IPrimeColumnDef<T> extends ColumnProps {
	colId: keyof T | string;
	colType: TPrimeColumnType;
	displayLabel: string;
	filterable?: boolean;
	disableHide?: boolean;
	defaultHidden?: boolean;
	globalFilterable?: boolean;
}

export interface IPrimeColumnConfig<T> extends ColumnProps {
	colId: keyof T | string;
	colType: TPrimeColumnType;
	filterable: boolean;
	displayLabel: string;
	disableHide: boolean;
	defaultHidden: boolean;
	globalFilterable: boolean;
	primeType: TBasePrimeColumnType;
	showFilterMatchModes: boolean;
}

export interface ISyncFusionGridColModel extends ColumnModel {
	colId: string;
}

export const tranSourceVals = Object.values(SourceType);

export const jobStatusVals = Object.values(JobStatus);

export const convertPrimeColType = (
	val: TPrimeColumnType | undefined | string
): TBasePrimeColumnType => {
	if (val === 'boolean') return 'boolean';
	else if (val === 'date' || val === 'datetime') return 'date';
	else if (val && ['integer', 'currency', 'numeric'].includes(val))
		return 'numeric';
	else return 'text';
};

export const checkShowsFilterMatchMode = (
	val: TPrimeColumnType | undefined | string
): boolean => {
	const falseResTypes = [
		'multiselect',
		'entityTypes',
		'accountTypeCategories',
		'tranSources',
		'jobStatuses'
	];

	if (val && falseResTypes.includes(val)) return false;
	else return true;
};

export const configurePrimeColumn = <T>(
	col: IPrimeColumnDef<T>
): IPrimeColumnConfig<T> => {
	const {
		colId,
		colType,
		displayLabel,
		filterable = false,
		disableHide = false,
		defaultHidden = false,
		globalFilterable = false,
		frozen = false, // Directly destructuring 'frozen' with a default value
		...props
	} = col;

	const primeType = convertPrimeColType(colType);

	const showFilterMatchModes = checkShowsFilterMatchMode(colType);

	// Using logical OR to simplify the logic for disableHide and defaultHidden
	const colDisableHidden = frozen || disableHide;
	// const colDefaultHidden = !colDisableHidden || defaultHidden;

	return {
		colId,
		colType,
		displayLabel,
		filterable,
		disableHide: colDisableHidden,
		defaultHidden,
		globalFilterable,
		primeType,
		showFilterMatchModes,
		dataType: primeType,
		...props
	};
};

export const getSourceTypeColor = (
	input: SourceType | undefined
):
	| 'error'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'info'
	| 'warning'
	| 'neutral' => {
	switch (input) {
		case SourceType.Auto:
			return 'info';
		case SourceType.Tiller:
			return 'success';
		case SourceType.Import:
			return 'secondary';
		case SourceType.Ui:
			return 'primary';
		default:
			return 'neutral';
	}
};
