import z from 'zod';

export const JournalHeaderRecSchema = z.object({
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	tranDate: z.coerce.date(),
	tranNumber: z.coerce.number().int(),
	bookId: z.number().nullable(),
	description: z.string()
});

export type TJournalHeaderRecSchema = z.infer<typeof JournalHeaderRecSchema>;

export const JournalLineRecSchema = z.object({
	id: z.number().int(),
	amount: z.coerce.number().int(),
	glAccountNumber: z.coerce.number().int().min(10000).max(99999),
	isDebit: z.boolean(),
	memo: z.string(),
	glAccount: z.lazy(() => GlAccInfoSchema)
});

export type TJournalLineRecSchema = z.infer<typeof JournalLineRecSchema>;

export const JournalRecSchema = JournalHeaderRecSchema.extend({
	entries: z.array(z.lazy(() => JournalLineRecSchema))
});

export type TJournalRecSchema = z.infer<typeof JournalRecSchema>;
