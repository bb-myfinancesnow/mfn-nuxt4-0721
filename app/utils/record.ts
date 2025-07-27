import z from 'zod';
import { AccountTypeClass } from '~/generated/graphql';

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

export const GlAccTypeInfoSchema = z.object({
	id: z.string(),
	name: z.string(),
	sortOrder: z.coerce.number().int(),
	class: z.nativeEnum(AccountTypeClass)
});

export type TGlAccTypeInfoSchema = z.infer<typeof GlAccTypeInfoSchema>;

export const GlAccInfoSchema = z.object({
	id: z.string(),
	accountNumber: z.coerce.number().int().min(10000).max(99999),
	name: z.string(),
	accountTypeName: z.string(),
	accountType: z.lazy(() => GlAccTypeInfoSchema),
	system: z.boolean()
}).transform((data) => ({
	...data,
	accountLabel: `${data.accountNumber} - ${data.name}`
}));

export type TGlAccInfoSchema = z.infer<typeof GlAccInfoSchema>;
