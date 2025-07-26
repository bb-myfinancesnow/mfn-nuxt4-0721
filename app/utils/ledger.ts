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
