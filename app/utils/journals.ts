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
