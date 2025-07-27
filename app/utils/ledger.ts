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
	tranNumber: z.coerce.number().int(),
	tranDate: z.coerce.date(),
	bookId: z.number().nullable(),
	description: z.string(),
	tranSource: z.nativeEnum(SourceType),
	reversalDate: z.coerce.date().nullable(),
	externalId: z.string().nullable(),
	createdFromTillerTranId: z.coerce.number().int().nullable(),
	idReversalOf: z.string().nullable(),
	postingPeriod: z.lazy(() => LedgerPeriodInfoSchema)
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

export const JournalEntryLedgerRecSchema = JournalLineRecSchema.extend({
	journalId: z.string(),
	entity: z.lazy(() => EntityInfoRecordSchena).nullable(),
	journal: z.lazy(() => JournalHeaderInfoSchema)
});

export type TJournalEntryLedgerRecSchema = z.infer<typeof JournalEntryLedgerRecSchema>;
