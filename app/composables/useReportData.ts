import {
	SearchPeriodRecordsDocument,
	type SearchPeriodRecordsQuery,
	type SearchPeriodRecordsQueryVariables
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

	return {
		searchPeriods
	};
};
