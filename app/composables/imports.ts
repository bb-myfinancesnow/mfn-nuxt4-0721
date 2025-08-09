import { createSharedComposable } from '@vueuse/core';

const _useImports = () => {
	const isLoading = ref(false);

	return {
		isLoading
	};
};

export const useImports = createSharedComposable(_useImports);
