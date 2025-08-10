import { SearchBulkJobSubmitDetailsDocument, type SearchBulkJobSubmitDetailsQuery, type SearchBulkJobSubmitDetailsQueryVariables } from '~/generated/graphql';

export const useJobs = () => {
	const { request } = useGql();

	const searchBulkJobsWithRecs = (variables?: SearchBulkJobSubmitDetailsQueryVariables) => {
		return useLazyAsyncData(
			`searchBulkJobsWithRecs-${JSON.stringify(variables)}`,
			() => request<SearchBulkJobSubmitDetailsQuery, SearchBulkJobSubmitDetailsQueryVariables>(SearchBulkJobSubmitDetailsDocument, variables),
			{
				transform: (input): TFullBulkJobSubmissionSchema[] => {
					const arrSchema = FullBulkJobSubmissionSchema.array();
					const safeRes = arrSchema.safeParse(input.bulkImportJobSubmissions);

					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TFullBulkJobSubmissionSchema[];
					}
				},
				default: () => [] as TFullBulkJobSubmissionSchema[]
			}
		);
	};

	return {
		searchBulkJobsWithRecs
	};
};
