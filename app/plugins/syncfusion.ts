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
import { GridPlugin } from '@syncfusion/ej2-vue-grids';
import { ChartPlugin } from '@syncfusion/ej2-vue-charts';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const licenseKey = config.public.syncFusionLicense;

	registerLicense(licenseKey);
	nuxtApp.vueApp.use(PivotViewPlugin);
	nuxtApp.vueApp.use(GridPlugin);
	nuxtApp.vueApp.use(ChartPlugin);

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
});
