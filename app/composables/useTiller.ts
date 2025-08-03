import {
	SearchTillerTranRecordsDocument,
	SortOrder,
	type SearchTillerTranRecordsQueryVariables,
	type SearchTillerTranRecordsQuery,
	type RunTillerSheetTransMutationVariables,
	type RunTillerSheetTransMutation,
	RunTillerSheetTransDocument,
	type CreateTillerGenImportJobMutationVariables,
	type CreateTillerGenImportJobMutation,
	CreateTillerGenImportJobDocument
} from '~/generated/graphql';

export const useTiller = () => {
	const { request } = useGql();

	const searchTillerTranRecs = (
		variables?: SearchTillerTranRecordsQueryVariables
	) => {
		if (!variables) {
			variables = {
				orderBy: [
					{ date: SortOrder.Desc },
					{ dateAdded: SortOrder.Desc },
					{ id: SortOrder.Asc }
				]
			};
		}
		return useLazyAsyncData(
			`searchTillerTranRecs-${JSON.stringify(variables)}`,
			() =>
				request<
					SearchTillerTranRecordsQuery,
					SearchTillerTranRecordsQueryVariables
				>(SearchTillerTranRecordsDocument, variables),
			{
				transform: (input): TTillerTranRecordSchema[] => {
					const arrSchema = TillerTranRecordSchema.array();
					const parsedData = arrSchema.parse(input.tillerTrans);
					return parsedData;
				},
				default: () => [] as TTillerTranRecordSchema[]
			}
		);
	};

	const runTillerSheetTrans = async (variables: RunTillerSheetTransMutationVariables): Promise<TRunTIllerSheetTranResSchema> => {
		// try {
		// 	const res = await request<RunTillerSheetTransMutation, RunTillerSheetTransMutationVariables>(RunTillerSheetTransDocument, variables);

		//   	console.log(`runTillerSheetTrans res: ${JSON.stringify(res.runTillerSheetTrans, null, 2)}`);

		//     const parsed
		// } catch (e) {
		// 	console.error(`error submit runTillerSheetTrans: ${e}`);
		// }
		console.log(`variables runTillerSheetTrans res: ${JSON.stringify(variables, null, 2)}`);

		const res = await request<RunTillerSheetTransMutation, RunTillerSheetTransMutationVariables>(RunTillerSheetTransDocument, variables);

		console.log(`runTillerSheetTrans res: ${JSON.stringify(res.runTillerSheetTrans, null, 2)}`);

		const parsedRes = await RunTIllerSheetTranResSchema.parseAsync(res.runTillerSheetTrans);

		return parsedRes;
	};

	const genTillerJournals = async (variables: CreateTillerGenImportJobMutationVariables) => {
		console.log(`variables genTillerJournals res: ${JSON.stringify(variables, null, 2)}`);

		const res = await request<CreateTillerGenImportJobMutation, CreateTillerGenImportJobMutationVariables>(CreateTillerGenImportJobDocument, variables);

		console.log(`runTillerSheetTrans res: ${JSON.stringify(res.addTillerGenImportJob, null, 2)}`);

		return res.addTillerGenImportJob;
	};

	return {
		searchTillerTranRecs,
		runTillerSheetTrans,
		genTillerJournals
	};
};
