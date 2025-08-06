import { SearchTranScheduleRecordsDocument, type SearchTranScheduleRecordsQuery, type SearchTranScheduleRecordsQueryVariables } from '~/generated/graphql';

export const useSchedules = () => {
	const { request } = useGql();

	const searchTranSchedRecords = (variables?: SearchTranScheduleRecordsQueryVariables) => {
		return useLazyAsyncData(
			`searchJournalHeaderDetails-${JSON.stringify(variables)}`,
			() =>
				request<
          SearchTranScheduleRecordsQuery,
          SearchTranScheduleRecordsQueryVariables
        >(SearchTranScheduleRecordsDocument, variables),
			{
				transform: (input): TTranSchedRecordSchema[] => {
					const arrSchema = TranSchedRecordSchema.array();
					const safeRes = arrSchema.safeParse(input.tranSchedules);

					if (safeRes.success) {
						return safeRes.data;
					} else {
						const stringErr = zodErrorToStringArray(safeRes.error);
						console.log(`parse err`, stringErr);
						return [] as TTranSchedRecordSchema[];
					}
				},
				default: () => [] as TTranSchedRecordSchema[]
			}
		);
	};
	return {
		searchTranSchedRecords
	};
};
