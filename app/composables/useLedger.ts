import {
	SearchJournalRecordsDocument,
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
					const parsedData = arrSchema.parse(input.journals);
					return parsedData;
				}
			}
		);
	};

	return {
		searchJournalRecs,
		searchJournalFormattedRecs
	};
};
