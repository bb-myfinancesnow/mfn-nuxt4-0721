import z from 'zod';
import { SourceType } from '~/generated/graphql';

export const LedgerPeriodInfoSchema = z.object({
	id: z.number().int(),
	label: z.string(),
	locked: z.boolean()
});

export type TLedgerPeriodInfoSchema = z.infer<typeof LedgerPeriodInfoSchema>;

export const JournalHeaderInfoSchema = z.object({
	id: z.string(),
	tranDate: z.coerce.date(),
	tranNumber: z.coerce.number().int(),
	bookId: z.number().nullable(),
	description: z.string(),
	tranSource: z.nativeEnum(SourceType),
	postingPeriod: z.lazy(() => LedgerPeriodInfoSchema),
	externalId: z.string().nullable(),
	reversalDate: z.coerce.date().nullable(),
	idReversalOf: z.string().nullable()
});

export type TJournalHeaderInfoSchema = z.infer<typeof JournalHeaderInfoSchema>;

export const JournalHeaderRecSchema = JournalHeaderInfoSchema.extend({
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export type TJournalHeaderRecSchema = z.infer<typeof JournalHeaderRecSchema>;

export const JournalLineRecSchema = z.object({
	id: z.number().int(),
	amount: z.coerce.number().int(),
	glAccountNumber: z.coerce.number().int().min(10000).max(99999),
	isDebit: z.boolean(),
	memo: z.string(),
	entityId: z.number().nullable(),
	glAccount: z.lazy(() => GlAccInfoSchema),
	entrySource: z.nativeEnum(SourceType)
});

export type TJournalLineRecSchema = z.infer<typeof JournalLineRecSchema>;

export const JournalRecSchema = JournalHeaderRecSchema.extend({
	entries: z.array(z.lazy(() => JournalLineRecSchema)),
	_count: z.object({
		entries: z.number(),
		migrationLoanChanges: z.number(),
		templateForTranSchedules: z.number()
	})
});

export type TJournalRecSchema = z.infer<typeof JournalRecSchema>;
