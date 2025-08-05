import z from 'zod';
import { SourceType, type JournalCreateInput, type JournalEntryInput } from '~/generated/graphql';

export const JournalRecInfoSchema = z.object({
	id: z.string(),
	tranNumber: z.coerce.number().int(),
	tranDate: z.coerce.date()
});

export type TJournalRecInfoSchema = z.infer<typeof JournalRecInfoSchema>;

export const JournalHeaderDetailSchema = JournalHeaderRecSchema.extend({
	book: z.lazy(() => BookLedgerInfoSchema).nullable(),
	postingYear: z.coerce.number().int(),
	postingMonth: z.coerce.number().int().min(0).max(11),
	_count: z.object({
		entries: z.number(),
		migrationLoanChanges: z.number(),
		templateForTranSchedules: z.number()
	})
});

export type TJournalHeaderDetailSchema = z.infer<typeof JournalHeaderDetailSchema>;

export const JournalLineDetailSchema = JournalLineRecSchema.extend({
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export type TJournalLineDetailSchema = z.infer<typeof JournalLineDetailSchema>;

export const JournalPageRecordSchema = JournalHeaderDetailSchema.extend({
	createdFromTillerTran: z.lazy(() => BaseTillerTranInfoSchema).nullable(),
	reversalOf: z.lazy(() => JournalRecInfoSchema).nullable(),
	reversedTransaction: z.lazy(() => JournalRecInfoSchema).nullable(),
	entries: z.array(z.lazy(() => JournalLineDetailSchema))
});

export type TJournalPageRecordSchema = z.infer<typeof JournalPageRecordSchema>;

export const JournalLineCreateSchema = z.object({
	memo: z.string().min(3, {
		message: 'Memo must be at least 3 characters.'
	}),
	glAccountNumber: z.coerce.number().int().min(10000).max(99999),
	debit: z.coerce.number().min(0),
	credit: z.coerce.number().min(0),
	entityId: z.coerce.number().int().optional().nullable()
});

export type TJournalLineCreateSchema = z.output<typeof JournalLineCreateSchema>;

export const UpdateJournalLineSchema = JournalLineCreateSchema.extend({
	id: z.number().int().optional()
});

export type TUpdateJournalLineSchema = z.output<typeof UpdateJournalLineSchema>;

export const JournalCreateSchema = z.object({
	description: z.string().min(3, {
		message: 'Description must be at least 3 characters.'
	}),
	tranDate: z.coerce.date(),
	externalId: z.string().optional(),
	reversalDate: z.coerce.date().optional(),
	bookId: z.number().int().optional(),
	inputLines: z
		.array(z.lazy(() => JournalLineCreateSchema))
		.min(1, 'Requires at least 1 line')
		.superRefine((val, ctx) => {
			const debitTotal = sumValuesByProperty(val, 'debit');
			const creditTotal = sumValuesByProperty(val, 'credit');

			const variance = roundToHundreths(debitTotal - creditTotal);

			if (variance !== 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Out of Balance by ${formatCurrency(variance)}`
				});
			}
		})
});

export type TJournalCreateSchema = z.infer<typeof JournalCreateSchema>;

export const UpdateJournalInputSchema = z.object({
	description: z.string().min(3, {
		message: 'Description must be at least 3 characters.'
	}),
	tranDate: z.coerce.date(),
	externalId: z.string().optional(),
	reversalDate: z.coerce.date().optional(),
	bookId: z.number().optional(),
	inputLines: z
		.array(z.lazy(() => UpdateJournalLineSchema))
		.min(1, 'Requires at least 1 line')
		.superRefine((val, ctx) => {
			const debitTotal = sumValuesByProperty(val, 'debit');
			const creditTotal = sumValuesByProperty(val, 'credit');

			const variance = roundToHundreths(debitTotal - creditTotal);

			if (variance !== 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Out of Balance by ${formatCurrency(variance)}`
				});
			}
		})
});

export type TUpdateJournalInputSchema = z.infer<typeof UpdateJournalInputSchema>;

export const journalLineToEntryInput = (
	line: TJournalLineCreateSchema
): JournalEntryInput => {
	const { debit, credit, ...rest } = line;
	const baseAmount = roundToHundreths(debit - credit);

	return {
		...rest,
		amount: Math.abs(Math.round(baseAmount * 100)),
		isDebit: baseAmount >= 0
	};
};

export const formToJournalCreateInput = async (
	input: TJournalCreateSchema
): Promise<JournalCreateInput> => {
	const { inputLines, ...header } = input;

	const entries = inputLines.map((l) => journalLineToEntryInput(l));
	return {
		...header,
		tranSource: SourceType.Ui,
		entries
	};
};
