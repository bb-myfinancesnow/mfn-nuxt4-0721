<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { upperFirst } from 'scule';
import { getPaginationRowModel } from '@tanstack/vue-table';

defineProps<{
	periodData: TReportPeriodSchema[];
	isLoading: boolean;
}>();

const DisplayBoolBadge = resolveComponent('DisplayBoolBadge');

const columns: TableColumn<TReportPeriodSchema>[] = [
	{
		accessorKey: 'id',
		header: '#',
		enableHiding: false,
		cell: ({ row }) => `#${row.getValue('id')}`
	},
	{
		accessorKey: 'label',
		header: 'Label',
		enableHiding: false
	},
	{
		accessorKey: 'month',
		header: 'Month',
		size: 2
	},
	{
		accessorKey: 'locked',
		header: 'Locked',
		cell: ({ row }) => {
			const val = row.original.locked;
			return h(DisplayBoolBadge, { val });
		},
		size: 2
	},
	{
		accessorKey: 'yearLabel',
		header: 'Year Label'
	},
	{
		accessorKey: 'quarterLabel',
		header: 'Quarter Label'
	},
	{
		accessorKey: 'year',
		header: 'Year',
		size: 2
	},
	{
		accessorKey: '_count.journals',
		header: 'Journal Count'
	},
	{
		accessorKey: 'startDate',
		header: 'Start Date',
		cell: ({ row }) => {
			return formatUSDate(row.original.startDate);
		}
	},
	{
		accessorKey: 'endDate',
		header: 'End Date',
		cell: ({ row }) => {
			return formatUSDate(row.original.endDate);
		}
	}
];

const table = useTemplateRef('table');
const columnVisibility = ref({
	month: false,
	year: false
});

const pagination = ref({
	pageIndex: 0,
	pageSize: 12
});
</script>

<template>
	<div class="w-full space-y-4 pb-4">
		<div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
			<UDropdownMenu
				:items="
					table?.tableApi
						?.getAllColumns()
						.filter((column) => column.getCanHide())
						.map((column) => ({
							label: upperFirst(column.id),
							type: 'checkbox' as const,
							checked: column.getIsVisible(),
							onUpdateChecked(checked: boolean) {
								table?.tableApi
									?.getColumn(column.id)
									?.toggleVisibility(!!checked);
							},
							onSelect(e?: Event) {
								e?.preventDefault();
							}
						}))
				"
				:content="{ align: 'end' }"
			>
				<UButton
					label="Columns Select"
					color="neutral"
					variant="outline"
					trailing-icon="i-lucide-chevron-down"
					class="ml-auto"
					aria-label="Columns select dropdown"
				/>
			</UDropdownMenu>
		</div>
		<UTable
			ref="table"
			v-model:column-visibility="columnVisibility"
			v-model:pagination="pagination"
			:data="periodData"
			:columns="columns"
			class="shrink-0"
			:loading="isLoading"
			:pagination-options="{
				getPaginationRowModel: getPaginationRowModel()
			}"
			:ui="{
				base: 'table-fixed border-separate border-spacing-0',
				thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
				tbody: '[&>tr]:last:[&>td]:border-b-0',
				th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
				td: 'border-b border-default'
			}"
		/>
		<div class="flex justify-center border-t border-default pt-4">
			<UPagination
				:default-page="
					(table?.tableApi?.getState().pagination.pageIndex
						|| 0) + 1
				"
				:items-per-page="
					table?.tableApi?.getState().pagination.pageSize
				"
				:total="
					table?.tableApi?.getFilteredRowModel().rows.length
				"
				@update:page="
					(p) => table?.tableApi?.setPageIndex(p - 1)
				"
			/>
		</div>
	</div>
</template>
