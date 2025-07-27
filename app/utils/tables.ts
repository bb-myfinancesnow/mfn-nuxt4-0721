import type { ColumnProps } from 'primevue/column';

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
		| 'tranSources';

export interface IPrimeColumnProps extends ColumnProps {
	colId: string;
	filterable: boolean;
	displayLabel: string;
	disableHide?: boolean;
	defaultHidden?: boolean;
}
