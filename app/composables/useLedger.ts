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
	return {
		searchJournalRecs
	};
};
