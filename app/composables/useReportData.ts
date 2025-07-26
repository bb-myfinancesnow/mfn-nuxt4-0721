import {
	SearchPeriodRecordsDocument,
	SearchReportJournalsDocument,
	type SearchPeriodRecordsQuery,
	type SearchPeriodRecordsQueryVariables,
	type SearchReportJournalsQuery,
	type SearchReportJournalsQueryVariables
} from '~/generated/graphql';

export const useReportData = () => {
	const { request } = useGql();

	const searchPeriods = (variables?: SearchPeriodRecordsQueryVariables) => {
		return useLazyAsyncData(
			`searchPeriods-${JSON.stringify(variables)}`,
			() =>
				request<
					SearchPeriodRecordsQuery,
					SearchPeriodRecordsQueryVariables
				>(SearchPeriodRecordsDocument, variables),
			{
				transform: (input): TReportPeriodSchema[] => {
					const arrSchema = ReportPeriodSchema.array();
					const parsedData = arrSchema.parse(input.periods);
					return parsedData;
				},
				default: () => [] as TReportPeriodSchema[]
			}
		);
	};

	const searchReportJournals = (variables?: SearchReportJournalsQueryVariables) => {
		return useLazyAsyncData(
			`searchReportJournals-${JSON.stringify(variables)}`,
			() => request<SearchReportJournalsQuery, SearchReportJournalsQueryVariables>(SearchReportJournalsDocument, variables)
		);
	};

	return {
		searchPeriods,
		searchReportJournals
	};
};
