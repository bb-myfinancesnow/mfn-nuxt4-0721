import z from 'zod';
import { TillerCategoryType } from '~/generated/graphql';

export const TillerCatRecordSchema = BaseIntIdDatesSchema.extend({
	name: z.string().nonempty(),
	type: z.nativeEnum(TillerCategoryType),
	group: z.string().nonempty(),
	glAccountNumber: z.number().nullable(),
	_count: z.object({
		tillerTrans: z.number()
	})
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
