import { registerLicense } from '@syncfusion/ej2-base';
import {
	PivotViewPlugin,
	GroupingBar,
	FieldList,
	CalculatedField,
	Toolbar,
	PDFExport,
	ExcelExport,
	ConditionalFormatting,
	NumberFormatting,
	PivotChart
} from '@syncfusion/ej2-vue-pivotview';
import {
	GridPlugin,
	Sort,
	Page,
	Filter,
	Resize,
	ColumnChooser,
	Group,
	ForeignKey,
	Freeze,
	Toolbar as GridToolbar,
	ExcelExport as GridExcelExport,
	Reorder,
	Aggregate
} from '@syncfusion/ej2-vue-grids';
import {
	ChartPlugin,
	AccumulationChartPlugin,
	LineSeries,
	Legend,
	Category,
	AccumulationLegend,
	PieSeries,
	AccumulationTooltip
} from '@syncfusion/ej2-vue-charts';

export default defineNuxtPlugin(async (nuxtApp) => {
	const config = useRuntimeConfig();
	const licenseKey = config.public.syncFusionLicense;

	registerLicense(licenseKey);

	nuxtApp.vueApp.use(PivotViewPlugin);
	nuxtApp.vueApp.use(GridPlugin);
	nuxtApp.vueApp.use(ChartPlugin);
	nuxtApp.vueApp.use(AccumulationChartPlugin);

	nuxtApp.vueApp.provide('pivotview', [
		GroupingBar,
		FieldList,
		CalculatedField,
		Toolbar,
		PDFExport,
		ExcelExport,
		ConditionalFormatting,
		NumberFormatting,
		PivotChart
	]);

	nuxtApp.vueApp.provide('grid', [
		Sort,
		Page,
		Filter,
		Resize,
		ColumnChooser,
		Group,
		ForeignKey,
		Freeze,
		GridToolbar,
		GridExcelExport,
		Reorder,
		Aggregate
	]);

	nuxtApp.vueApp.provide('chart', [LineSeries, Legend, Category]);

	nuxtApp.vueApp.provide('accumulationchart', [
		PieSeries,
		AccumulationLegend,
		AccumulationTooltip
	]);
});
