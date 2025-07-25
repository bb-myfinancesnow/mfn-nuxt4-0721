import z from 'zod';

export const BaseIntIdDatesSchema = z.object({
	id: z.number().int(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export type TBaseIntIdDatesSchema = z.infer<typeof BaseIntIdDatesSchema>;

export const BookRecordSchema = z.object({
	createdAt: z.coerce.date(),
	id: z.number().int(),
	name: z.string(),
	system: z.boolean(),
	updatedAt: z.coerce.date(),
	_count: z.object({
		journals: z.number()
	})
});

export type TBookRecordSchema = z.infer<typeof BookRecordSchema>;

export const NewBookInputSchema = z.object({
	name: z.string().min(3, {
		message: 'Name must be at least 3 characters.'
	})
});

export type TNewBookInput = z.infer<typeof NewBookInputSchema>;
