import z from 'zod';
import { JobStatus } from '~/generated/graphql';

export const BulkJobSubRecordSchema = BaseStringIdDatesSchema.extend({
	queue: z.string(),
	recordTotal: z.coerce.number(),
	startedAt: z.coerce.date().nullable(),
	finishedAt: z.coerce.date().nullable(),
	status: z.nativeEnum(JobStatus),
	successCount: z.coerce.number(),
	errorCount: z.coerce.number(),
	attempts: z.coerce.number(),
	jobError: z.string().nullable(),
	_count: z.object({
		records: z.number()
	})
});

export type TBulkJobSubRecordSchema = z.infer<typeof BulkJobSubRecordSchema>;

export const BulkImportRecordInfoSchema = z.object({
	id: z.string(),
	submissionId: z.string(),
	isSuccess: z.boolean(),
	recordError: z.string().nullable(),
	resultMessage: z.string().nullable()
});

export type TBulkImportRecordInfoSchema = z.infer<typeof BulkImportRecordInfoSchema>;

export const FullBulkJobSubmissionSchema = BulkJobSubRecordSchema.extend({
	records: z.array(z.lazy(() => BulkImportRecordInfoSchema))
});

export type TFullBulkJobSubmissionSchema = z.infer<typeof FullBulkJobSubmissionSchema>;
