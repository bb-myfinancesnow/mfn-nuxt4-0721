/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TObjAny } from '~/types';

// Function to group items by a property
export function groupByProperty<
	T extends Record<string, any>,
	K extends keyof T
>(array: T[], key: K): Record<string, T[]> {
	return array.reduce(
		(result, currentValue) => {
			// Extract the key value
			const groupKey = currentValue[key];

			// Ensure the result has an array for this key
			if (!result[groupKey]) {
				result[groupKey] = [];
			}

			// Push the current value to the corresponding group
			result[groupKey].push(currentValue);

			return result;
		},
		{} as Record<string, T[]>
	);
}

export function arrayToKeyedObject<T, K extends keyof T>(
	array: T[],
	key: K
): Record<T[K] & PropertyKey, T> {
	return array.reduce(
		(acc, item) => {
			acc[item[key] as T[K] & PropertyKey] = item;
			return acc;
		},
		{} as Record<T[K] & PropertyKey, T>
	);
}

export const returnDefinedProperties = (obj: TObjAny): TObjAny => {
	const newData: TObjAny = {};
	const keys = Object.keys(obj);

	for (const key of keys) {
		const value = obj[key];
		if (value != null) {
			newData[key] = value;
		}
	}

	return newData;
};

export const findDuplicateValues = <T>(arr: T[]): T[] => {
	const uniqueSet = new Set(arr);

	return arr.filter((v) => {
		if (uniqueSet.has(v)) {
			uniqueSet.delete(v);
		} else return v;
	});
};

export const deDupNumberArray = (arr: number[]): number[] => {
	return [...new Set(arr)];
};

export const deDupStringArray = (arr: string[]): string[] => {
	return [...new Set(arr)];
};

export const removeNulls = <T>(arr: (T | null)[]): T[] => {
	return arr.filter((v) => v != null) as T[];
};

export const sumArray = (arr: number[]): number => {
	return arr.reduce((acc, curr) => acc + curr, 0);
};

export function chunkArray<T>(array: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}

/**
 * returns elements from arr not present in compareTo
 */
export const checkForMissingElements = (
	arr: string[],
	compareTo: string[]
): string[] => {
	const compareToSet = new Set(compareTo);
	return arr.filter((x) => !compareToSet.has(x));
};

// Define a generic function to sum values of a specified property within an array of objects.
// This function is generic and can work with any array of objects as long as the property value is a number.
export const sumValuesByProperty = <T>(
	arr: T[], // The array of objects of generic type T.
	property: keyof T // The property key to sum up, which must be a key of type T.
): number => {
	// Use the array reduce method to iterate over each element and accumulate the sum.
	return arr.reduce((acc, curr) => {
		// acc is the accumulator, curr is the current object.
		const v = curr[property]; // Retrieve the value of the specified property from the current object.
		if (typeof v === 'number') {
			// Ensure the property value is a number before adding it.
			return acc + v; // If it is a number, add the value to the accumulator.
		} else {
			return acc; // If not a number, just return the current accumulated value.
		}
	}, 0); // Initialize the accumulator with 0 for the summation.
};

export function firstMissingPositive(nums: number[]): number {
	const numSet = new Set<number>(nums);

	let missing = 1;
	while (numSet.has(missing)) {
		missing++;
	}

	return missing;
}

export function incrementIntegerFrom(nums: number[], startAt?: number): number {
	const numSet = new Set<number>(nums);

	const incrementFrom
    = startAt && typeof startAt === 'number' ? startAt : Math.min(...nums);

	let missing = incrementFrom > 0 ? incrementFrom : 1;
	while (numSet.has(missing)) {
		missing++;
	}

	return missing;
}

/**
 * Removes an element from an array by its index.
 * @param array - The array from which to remove the element.
 * @param index - The index of the element to remove.
 * @returns A new array with the element removed.
 */
export function removeElementByIndex<T>(array: T[], index: number): T[] {
	if (index < 0 || index >= array.length) {
		console.error('Invalid index');
		return array;
	}
	// Create a copy of the array to avoid modifying the original
	const newArray = [...array];
	newArray.splice(index, 1);
	return newArray;
}

// Function to transform the object keys based on the mapping array
export function transformObjectKeys(
	obj: { [key: string]: any },
	mappings: { oldKey: string; newKey: string }[]
): { [key: string]: any } {
	const transformedObject: { [key: string]: any } = {};

	for (const { oldKey, newKey } of mappings) {
		if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
			transformedObject[newKey] = obj[oldKey];
		}
	}

	// // Include other properties not in the mapping array if needed
	// for (const key in obj) {
	//   if (!mappings.some((mapping) => mapping.oldKey === key)) {
	//     transformedObject[key] = obj[key];
	//   }
	// }

	return transformedObject;
}

export function deduplicateArray<T>(array: T[], key: keyof T): T[] {
	const uniqueObjects = new Map<any, T>();

	for (const item of array) {
		// Use the value of the specified key as the map's unique key
		if (!uniqueObjects.has(item[key])) {
			uniqueObjects.set(item[key], item);
		}
	}

	// Convert the map values back to an array
	return Array.from(uniqueObjects.values());
}

export function deduplicateArrayByMultipleKeys<T>(
	array: T[],
	keys: (keyof T)[]
): T[] {
	const uniqueObjects = new Map<string, T>();

	for (const item of array) {
		// Create a unique identifier based on the combination of keys
		const uniqueKey = keys.map((key) => item[key]).join('|');

		if (!uniqueObjects.has(uniqueKey)) {
			uniqueObjects.set(uniqueKey, item);
		}
	}

	return Array.from(uniqueObjects.values());
}

export function transformObjectValues<T extends object, U>(
	obj: T,
	transformFn: (value: T[keyof T]) => U
): { [K in keyof T]: U } {
	const result = {} as { [K in keyof T]: U };

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			// Use explicit casting to assure TypeScript of the correct key-value relationship
			const value = obj[key as keyof T];
			result[key as keyof T] = transformFn(value);
		}
	}

	return result;
}

/// Define the KeyIndexMap type
export type KeyIndexMap = Record<string, number>;

export function getDifferences(
	obj1: Record<string, any>,
	obj2: Record<string, any>
) {
	const diffs: Record<string, { from: any; to: any }> = {};

	const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

	for (const key of keys) {
		if (obj1[key] !== obj2[key]) {
			diffs[key] = { from: obj1[key], to: obj2[key] };
		}
	}

	return diffs;
}

export function getChangedProps<T extends Record<string, any>>(
	a: T,
	b: T
): Partial<T> {
	const result: Partial<T> = {};

	for (const key of Object.keys({ ...a, ...b }) as (keyof T)[]) {
		if (a[key] !== b[key]) {
			result[key] = b[key];
		}
	}

	return result;
}

// Convert camelCase or snake_case to Title Case labels
export const toStringLabel = (key: string) =>
	key
		.replace(/_/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/\b\w/g, (c) => c.toUpperCase());

export function getMinByNumber<T>(arr: T[], key: keyof T): T | undefined {
	if (arr.length === 0) return undefined;
	return arr.reduce((min, curr) =>
		(curr[key] as number) < (min[key] as number) ? curr : min
	);
}

export function getMaxByNumber<T>(arr: T[], key: keyof T): T | undefined {
	if (arr.length === 0) return undefined;
	return arr.reduce((max, curr) =>
		(curr[key] as number) > (max[key] as number) ? curr : max
	);
}
