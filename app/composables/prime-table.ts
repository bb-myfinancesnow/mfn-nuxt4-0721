import type { DataTableFilterMeta } from 'primevue/datatable';
import { FilterMatchMode } from '@primevue/core/api';

interface UsePrimeTableOptions<T> {
	columnDefs: IPrimeColumnDef<T>[];
	defaultFilters?: DataTableFilterMeta;
	defaultRows?: number;
}

export const usePrimeTable = <T>(options: UsePrimeTableOptions<T>) => {
	const { columnDefs, defaultRows = 10, defaultFilters = {	global: { value: null, matchMode: FilterMatchMode.CONTAINS } } } = options;

	// const colInputs = ref<IPrimeColumnDef<T>[]>(columnDefs);
	const colInputs = toValue(columnDefs);
	const columnOptions = ref<IPrimeColumnConfig<T>[]>([]);

	const visibleColumns = ref<IPrimeColumnConfig<T>[]>([]);
	const filters = ref();

	const resetVisibleColumns = () => {
		const cols = columnOptions.value.filter((col) => !col.defaultHidden);
		visibleColumns.value = cols;
	};

	const updateVisCols = (cols: IPrimeColumnConfig<T>[]) => {
		visibleColumns.value = cols;
	};

	const setupColConfigs = () => {
		const cols = colInputs.map((c) => configurePrimeColumn(c));
		columnOptions.value = cols;
	};

	const globalFilterFieldKeys = computed<string[]>(() => {
		return columnOptions.value
			.filter((col) => col.globalFilterable)
			.map((col) => col.colId as string);
	});

	const initFilters = () => {
		filters.value = defaultFilters;
	};

	const clearFilter = () => {
		initFilters();
	};

	watch(() => colInputs, setupColConfigs, { immediate: true });

	return {
		columnOptions,
		defaultRows,
		visibleColumns,
		filters,
		globalFilterFieldKeys,
		initFilters,
		clearFilter,
		resetVisibleColumns,
		updateVisCols
	};
};
