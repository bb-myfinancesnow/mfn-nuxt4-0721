import z from 'zod';
import { TillerCategoryType } from '~/generated/graphql';

export const GeneratedJournalSchema = z.object({
	id: z.string(),
	tranNumber: z.coerce.number().int()
});

export type TGeneratedJournalSchema = z.infer<typeof GeneratedJournalSchema>;

export const TillerCatRecordSchema = BaseIntIdDatesSchema.extend({
	name: z.string().nonempty(),
	type: z.nativeEnum(TillerCategoryType),
	group: z.string().nonempty(),
	glAccountNumber: z.number().nullable(),
	_count: z.object({
		tillerTrans: z.number()
	}),
	glAccount: z.lazy(() => GlAccInfoSchema).nullable()
}).transform((data) => {
	const glAccountLabel = data.glAccount?.accountLabel ?? null;
	const glAccountTypeName = data.glAccount?.accountTypeName ?? null;
	const glAccountClass = data.glAccount?.accountType.class ?? null;

	return {
		...data,
		glAccountLabel,
		glAccountTypeName,
		glAccountClass
	};
});

export type TTillerCatRecordSchema = z.infer<typeof TillerCatRecordSchema>;

export const TillerAccRecordSchema = BaseIntIdDatesSchema.extend({
	name: z.string().nonempty(),
	accountId: z.string().nonempty(),
	glAccountNumber: z.number(),
	group: z.string().nonempty(),
	institution: z.string().nonempty(),
	_count: z.object({
		tillerTrans: z.number()
	}),
	glAccount: z.lazy(() => GlAccInfoSchema)
});

export type TTillerAccRecordSchema = z.infer<typeof TillerAccRecordSchema>;

export const BaseTillerCatInfoSchema = z.object({
	id: z.number().int(),
	name: z.string().nonempty(),
	type: z.nativeEnum(TillerCategoryType),
	group: z.string().nonempty(),
	glAccountNumber: z.number().nullable(),
	_count: z.object({
		tillerTrans: z.number()
	})
});

export type TBaseTillerCatInfoSchema = z.infer<typeof BaseTillerCatInfoSchema>;

export const BaseTillerAccInfoSchema = z.object({
	id: z.number().int(),
	name: z.string().nonempty(),
	glAccountNumber: z.number(),
	group: z.string().nonempty(),
	institution: z.string().nonempty(),
	_count: z.object({
		tillerTrans: z.number()
	})
});

export type TBaseTillerAccInfoSchema = z.infer<typeof BaseTillerAccInfoSchema>;

export const BaseTillerTranInfoSchema = z.object({
	id: z.number().int(),
	date: z.coerce.date(),
	dateAdded: z.coerce.date(),
	account: z.string(),
	category: z.string(),
	amount: z.coerce.number(),
	reconciled: z.coerce.boolean(),
	excluded: z.coerce.boolean(),
	generatedJournal: z.lazy(() => GeneratedJournalSchema).nullable()
});

export type TBaseTillerTranInfoSchema = z.infer<typeof BaseTillerTranInfoSchema>;

export const BaseTillerInfosSchema = z.object({
	tillerAccounts: z.array(z.lazy(() => BaseTillerAccInfoSchema)),
	tillerCategories: z.array(z.lazy(() => BaseTillerCatInfoSchema)),
	tillerTrans: z.array(z.lazy(() => BaseTillerTranInfoSchema))
});

export type TBaseTillerInfosSchema = z.infer<typeof BaseTillerInfosSchema>;

export const TillerTranRecordSchema = BaseIntIdDatesSchema.extend({
	date: z.coerce.date(),
	dateAdded: z.coerce.date(),
	description: z.string().nonempty(),
	reconciled: z.coerce.boolean(),
	transactionId: z.string().nonempty(),
	excluded: z.coerce.boolean(),
	category: z.string().nonempty(),
	account: z.string().nonempty(),
	amount: z.coerce.number(),
	generatedJournal: z.lazy(() => GeneratedJournalSchema).nullable()
}).transform((data) => {
	const generatedJournalId = data.generatedJournal?.id ?? null;
	const generatedJournalNumber = data.generatedJournal?.tranNumber ?? null;

	return {
		...data,
		generatedJournalId,
		generatedJournalNumber,
		decimalAmount: data.amount / 100
	};
});

export type TTillerTranRecordSchema = z.infer<typeof TillerTranRecordSchema>;

export const RawTillerSheetTranSchema = z.object({
	account: z.string().nonempty(),
	amount: z.coerce.number(),
	date: z.coerce.date(),
	dateAdded: z.coerce.date(),
	category: z.string(),
	description: z.string().nonempty(),
	transactionId: z.string().nonempty()
});

export type TRawTillerSheetTranSchema = z.infer<typeof RawTillerSheetTranSchema>;

export const RunTillerSheetTranResSchema = z.object({
	createdCount: z.number().int(),
	newTranCount: z.number().int(),
	missingCategories: z.string().array(),
	missingAccounts: z.string().array(),
	pending: z.array(z.lazy(() => RawTillerSheetTranSchema))
});

export type TRunTillerSheetTranResSchema = z.infer<typeof RunTillerSheetTranResSchema>;

export const GetTillerTranAggsSchema = z.object({
	idCount: z.number().int(),
	tranIdCount: z.number().int(),
	minCreatedAt: z.coerce.date().nullable(),
	minDate: z.coerce.date().nullable(),
	minDateAdded: z.coerce.date().nullable(),
	maxCreatedAt: z.coerce.date().nullable(),
	maxDate: z.coerce.date().nullable(),
	maxDateAdded: z.coerce.date().nullable(),
	unRecCount: z.number().int()
});

export type TGetTillerTranAggsSchema = z.infer<typeof GetTillerTranAggsSchema>;
