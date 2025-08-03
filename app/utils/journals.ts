import z from 'zod';

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
