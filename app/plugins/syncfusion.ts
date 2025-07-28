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
	NumberFormatting
} from '@syncfusion/ej2-vue-pivotview';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const licenseKey = config.public.syncFusionLicense;

	registerLicense(licenseKey);
	nuxtApp.vueApp.use(PivotViewPlugin);

	nuxtApp.vueApp.provide('pivotview', [
		GroupingBar,
		FieldList,
		CalculatedField,
		Toolbar,
		PDFExport,
		ExcelExport,
		ConditionalFormatting,
		NumberFormatting
	]);
});
