import {
	SearchJournalDetailsDocument,
	type SearchJournalDetailsQuery,
	type SearchJournalDetailsQueryVariables
} from '~/generated/graphql';

export const useJournals = () => {
	const { request } = useGql();

	const searchJournalHeaderDetails = (
		variables?: SearchJournalDetailsQueryVariables
	) => {
		return useLazyAsyncData(
			`searchJournalHeaderDetails-${JSON.stringify(variables)}`,
			() =>
				request<
					SearchJournalDetailsQuery,
					SearchJournalDetailsQueryVariables
				>(SearchJournalDetailsDocument, variables),
			{
				transform: (input): TJournalHeaderDetailSchema[] => {
					const arrSchema = JournalHeaderDetailSchema.array();
					const safeRes = arrSchema.safeParse(input.journals);

					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TJournalHeaderDetailSchema[];
					}
				},
				default: () => [] as TJournalHeaderDetailSchema[]
			}
		);
	};

	return {
		searchJournalHeaderDetails
	};
};
