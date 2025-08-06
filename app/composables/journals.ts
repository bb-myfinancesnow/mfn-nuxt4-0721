import {
	CreateNewJournalDocument,
	GetJournalPageRecordDocument,
	SearchJournalDetailsDocument,
	type CreateNewJournalMutation,
	type CreateNewJournalMutationVariables,
	type GetJournalPageRecordQuery,
	type GetJournalPageRecordQueryVariables,
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

	const getJournalPageRecord = (
		variables: GetJournalPageRecordQueryVariables
	) => {
		return useLazyAsyncData(
			`getJournalPageRecord-${JSON.stringify(variables)}`,
			() =>
				request<
					GetJournalPageRecordQuery,
					GetJournalPageRecordQueryVariables
				>(GetJournalPageRecordDocument, variables),
			{
				transform: (input): TJournalPageRecordSchema => {
					const parsed = JournalPageRecordSchema.parse(input.journal);
					return parsed;
				}
			}
		);
	};

	const createJournalMutation = (
		variables: CreateNewJournalMutationVariables
	) => {
		return request<
			CreateNewJournalMutation,
			CreateNewJournalMutationVariables
		>(CreateNewJournalDocument, variables);
	};

	return {
		searchJournalHeaderDetails,
		getJournalPageRecord,
		createJournalMutation
	};
};
