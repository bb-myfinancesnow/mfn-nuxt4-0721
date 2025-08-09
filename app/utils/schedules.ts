import { add, getDate, getDay, setDate, setDay } from 'date-fns';
import { RecurrenceFrequency, Weekday } from '~/generated/graphql';

export const frequencyOptions = [
	{
		label: 'Monthly',
		value: RecurrenceFrequency.Monthly
	},
	{
		label: 'Weekly',
		value: RecurrenceFrequency.Weekly
	},
	{
		label: 'Yearly',
		value: RecurrenceFrequency.Yearly
	},
	{
		label: 'Daily',
		value: RecurrenceFrequency.Daily
	}
];

export const weekdayOptions = Object.entries(Weekday).map(([k, v]) => ({
	label: k,
	value: v
}));

export type TWeekdayVal = {
	label: string;
	value: Weekday;
	num: number;
};

export const weekdayValOptions: TWeekdayVal[] = [
	{
		label: 'Sunday',
		value: Weekday.Sunday,
		num: 0
	},
	{
		label: 'Monday',
		value: Weekday.Monday,
		num: 1
	},
	{
		label: 'Tuesday',
		value: Weekday.Tuesday,
		num: 2
	},
	{
		label: 'Wednesday',
		value: Weekday.Wednesday,
		num: 3
	},
	{
		label: 'Thursday',
		value: Weekday.Thursday,
		num: 4
	},
	{
		label: 'Friday',
		value: Weekday.Friday,
		num: 5
	},
	{
		label: 'Saturday',
		value: Weekday.Saturday,
		num: 6
	}
];

export const getWeekdayOption = async (input: Date): Promise<TWeekdayVal> => {
	const dayOfWeek = getDay(input);

	const found = weekdayValOptions.find((v) => v.num === dayOfWeek);

	if (!found) throw new Error(`Invalid Day of Week Input ${input}`);

	return found;
};

export const getWeekdayFromValue = async (input: Weekday): Promise<TWeekdayVal> => {
	const found = weekdayValOptions.find((v) => v.value === input);

	if (!found) throw new Error(`Invalid Day of Week Input ${input}`);

	return found;
};

export type TCalcSchedStartParams = {
	freq?: RecurrenceFrequency;
	interval?: number;
	dayOfMonth?: number;
	dayOfWeek?: TWeekdayVal;
	tranDate: Date;
};

export type TSchedStartResult = {
	defaultStartDate: Date;
	minStartDate: Date;
};

export const calcSchedStart = async ({
	tranDate,
	...params
}: TCalcSchedStartParams): Promise<TSchedStartResult> => {
	const minStartDate = add(tranDate, { days: 1 });

	const dayOfMonthVal = getDate(tranDate);
	const dayOfWeekVal = await getWeekdayOption(tranDate);

	if (!params.freq || !params.interval) {
		return {
			defaultStartDate: minStartDate,
			minStartDate
		};
	} else {
		const {
			freq,
			dayOfMonth = dayOfMonthVal,
			dayOfWeek = dayOfWeekVal,
			interval
		} = params;

		if (freq === RecurrenceFrequency.Yearly) {
			const addIntervalDate = add(tranDate, { years: interval });
			const defaultStartDate = setDate(addIntervalDate, dayOfMonth);

			return {
				defaultStartDate,
				minStartDate
			};
		} else if (freq === RecurrenceFrequency.Monthly) {
			let firstIntervalDate = add(tranDate, { months: interval });
			const firstIntervalDay = getDate(firstIntervalDate);
			if (firstIntervalDay < dayOfMonth)
				firstIntervalDate = add(firstIntervalDate, { months: 1 });

			const defaultStartDate = setDate(firstIntervalDate, dayOfMonth);
			return {
				defaultStartDate,
				minStartDate
			};
		} else if (freq === RecurrenceFrequency.Weekly) {
			const toWeekdayFirst = setDay(tranDate, dayOfWeek.num);
			const defaultStartDate = add(toWeekdayFirst, { weeks: interval });

			return {
				defaultStartDate,
				minStartDate
			};
		} else {
			return {
				defaultStartDate: minStartDate,
				minStartDate
			};
		}
	}
};
