import { format } from 'date-fns';

export const formatUSDate = (val: Date) => {
	return val.toLocaleDateString('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const formatIntCurrency = (value: number) => {
	const val = value / 100;
	return formatCurrency(val);
};

export const formatCurrencyOpt = (value: number | undefined) =>
	typeof value === 'number'
		? (value / 100).toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			})
		: '';

export const formatIntAccountingCurrency = (value: number) => {
	const val = value / 100;
	const valAbs = Math.abs(val);

	if (val < 0) {
		return `(${formatCurrency(valAbs)})`;
	}

	return formatCurrency(val);
};

export const formatDateTimeObjVal = (v: Date): string => {
	return format(v, 'MM/dd/yyyy h:mm:ss aaa');
};

export const formattedDateTimeValue = (v: string | null) => {
	// console.log(`toTableDataDateTime v ${v} && type ${typeof v}`);

	if (v == null) return '';
	else {
		const d = new Date(Date.parse(v));
		return format(d, 'MM/dd/yyyy h:mm aaa');
	}
};

export function toRegexCamelCase(str: string): string {
	return str
		.toLowerCase()
		.split(/[-_\s]/)
		.map((word, index) => {
			return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join('');
}

export const toCamelCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(' ')
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join('');
};

/**
 * Rounds a number to the specified precision.
 *
 * @param {number} num - The number to round.
 * @param {number} to - The precision to round to. This is the multiple of ten that
 *                      the number will be rounded to (e.g., 100 for two decimal places).
 * @returns {number} - The rounded number.
 *
 * @category Formatting
 * @group Libs
 */
export const roundTo = (num: number, to: number): number => {
	// Use Math.round to round 'num' to the nearest 'to'. Adding Number.EPSILON before
	// rounding mitigates issues where floating-point arithmetic might cause an incorrect
	// rounding result (e.g., 1.005 * 100 would otherwise round to 100 instead of 101).
	return Math.round(num * to) / to;
};

/**
 * Rounds a number to two decimal places (hundredths).
 *
 * @param {number} num - The number to round.
 * @returns {number} - The number rounded to two decimal places.
 *
 *
 * @category Formatting
 * @group Libs
 */
export const roundToHundreths = (num: number): number => {
	// Call roundTo with 'to' parameter set to 100 to round to hundredths.
	return roundTo(num, 100);
};

export function camelOrPascalToLabel(str: string): string {
	return (
		str
		// Handle acronym boundaries like "userID" -> "user ID"
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		// Handle camelCase or PascalCase
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		// Capitalize the first letter
			.replace(/^./, (match) => match.toUpperCase())
	);
}
