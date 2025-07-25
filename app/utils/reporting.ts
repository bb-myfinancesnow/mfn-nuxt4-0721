import z from 'zod';

export const ReportBookSchema = BookRecordSchema.omit({ createdAt: true, updatedAt: true });

export type TReportBookSchema = z.infer<typeof ReportBookSchema>;

export const ReportPeriodSchema = z.object({
	id: z.number().int(),
	label: z.string(),
	month: z.coerce.number().int().min(0).max(11),
	year: z.coerce.number().int().min(2023).max(2050),
	locked: z.boolean(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	quarter: z.coerce.number().int().min(1).max(4),
	_count: z.object({
		journals: z.number()
	})
}).transform((data) => ({
	...data,
	yearLabel: `FY ${data.year}`,
	quarterLabel: `Q${data.quarter} ${data.year}`
}));

export type TReportPeriodSchema = z.infer<typeof ReportPeriodSchema>;
