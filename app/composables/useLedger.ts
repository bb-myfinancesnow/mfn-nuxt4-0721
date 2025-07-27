import {
	SearchJeLineRecordsDocument,
	SearchJournalRecordsDocument,
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
			() => request<SearchJournalRecordsQuery, SearchJeLineRecordsQueryVariables>(SearchJeLineRecordsDocument, variables)
		);
	};

	return {
		searchJournalRecs,
		searchJournalFormattedRecs,
		searchEntryRecs
	};
};
