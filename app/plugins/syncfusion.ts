import { registerLicense } from '@syncfusion/ej2-base';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const licenseKey = config.public.syncFusionLicense;

	registerLicense(licenseKey);
});
