import {
	SearchJeLineRecordsDocument,
	SearchJournalRecordsDocument,
	type SearchJeLineRecordsQuery,
	type SearchJeLineRecordsQueryVariables,
	type SearchJournalRecordsQuery,
	type SearchJournalRecordsQueryVariables
} from '~/generated/graphql';

export const useLedger = () => {
	const { request } = useGql();

	const searchJournalRecs = (
		variables?: SearchJournalRecordsQueryVariables
	) => {
		return useLazyAsyncData(
			`searchJournalRecs-${JSON.stringify(variables)}`,
			() =>
				request<
					SearchJournalRecordsQuery,
					SearchJournalRecordsQueryVariables
				>(SearchJournalRecordsDocument, variables)
		);
	};

	const searchJournalFormattedRecs = (
		variables?: SearchJournalRecordsQueryVariables
	) => {
		return useLazyAsyncData(
			`searchJournalFormattedRecs-${JSON.stringify(variables)}`,
			() =>
				request<
					SearchJournalRecordsQuery,
					SearchJournalRecordsQueryVariables
				>(SearchJournalRecordsDocument, variables),
			{
				transform: (input): TJournalRecSchema[] => {
					const arrSchema = JournalRecSchema.array();
					const safeRes = arrSchema.safeParse(input.journals);
					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TJournalRecSchema[];
					}
					// const parsedData = arrSchema.parse(input.journals);
					// return parsedData;
				},
				default: () => [] as TJournalRecSchema[]
			}
		);
	};

	const searchEntryRecs = (variables?: SearchJeLineRecordsQueryVariables) => {
		return useLazyAsyncData(
			`searchEntryRecs-${JSON.stringify(variables)}`,
			() => request<SearchJeLineRecordsQuery, SearchJeLineRecordsQueryVariables>(SearchJeLineRecordsDocument, variables),
			{
				transform: (input): TJournalEntryLedgerRecSchema[] => {
					const arrSchema = JournalEntryLedgerRecSchema.array();
					const safeRes = arrSchema.safeParse(input.journalEntries);
					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TJournalEntryLedgerRecSchema[];
					}
				},
				default: () => [] as TJournalEntryLedgerRecSchema[]
			}
		);
	};

	const searchGlEntryRecs = (variables?: SearchJeLineRecordsQueryVariables) => {
		return useLazyAsyncData(
			`searchGlEntryRecs-${JSON.stringify(variables)}`,
			() => request<SearchJeLineRecordsQuery, SearchJeLineRecordsQueryVariables>(SearchJeLineRecordsDocument, variables),
			{
				transform: (input): TFlatJournalEntryLedgerRecSchema[] => {
					const arrSchema = FlatJournalEntryLedgerRecSchema.array();
					const safeRes = arrSchema.safeParse(input.journalEntries);
					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TFlatJournalEntryLedgerRecSchema[];
					}
				},
				default: () => [] as TFlatJournalEntryLedgerRecSchema[]
			}
		);
	};

	return {
		searchJournalRecs,
		searchJournalFormattedRecs,
		searchEntryRecs,
		searchGlEntryRecs
	};
};
