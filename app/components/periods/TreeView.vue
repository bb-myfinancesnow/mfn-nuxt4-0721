<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { getGroupedRowModel } from '@tanstack/vue-table';
import type { GroupingOptions } from '@tanstack/vue-table';

defineProps<{
	periodData: TReportPeriodSchema[];
	isLoading: boolean;
}>();

const DisplayBoolBadge = resolveComponent('DisplayBoolBadge');

const columns: TableColumn<TReportPeriodSchema>[] = [
	{
		id: 'title',
		header: 'Item'
	},
	{
		id: 'year_label',
		accessorKey: 'yearLabel'
	},
	{
		id: 'quarter_label',
		accessorKey: 'quarterLabel'
	},
	{
		accessorKey: 'label',
		header: 'Label'
	},
	{
		accessorKey: 'locked',
		header: 'Locked',
		cell: ({ row }) => {
			// const lockedVal = row.getIsGrouped()
			const val = row.original.locked;
			return h(DisplayBoolBadge, { val });
		},
		size: 2
	},
	{
		id: 'locked_c',
		header: 'LC',
		accessorKey: 'locked',
		aggregationFn: 'uniqueCount'
	},
	{
		accessorKey: '_count.journals',
		header: 'Journal Count',
		aggregationFn: 'sum'
	},

	{
		accessorKey: 'id',
		header: '#',
		cell: ({ row }) =>
			row.getIsGrouped() ? `${row.getValue('id')} records` : `ID${row.getValue('id')}`,
		aggregationFn: 'count'
	}
];

const grouping_options = ref<GroupingOptions>({
	groupedColumnMode: 'remove',
	getGroupedRowModel: getGroupedRowModel()
});
</script>

<template>
	<div class="w-full space-y-4 pb-4">
		<UTable
			:data="periodData"
			:columns="columns"
			:grouping="['year_label', 'quarter_label']"
			:grouping-options="grouping_options"
			:ui="{
				root: 'min-w-full',
				td: 'empty:p-0' // helps with the colspaned row added for expand slot
			}"
		>
			<template #title-cell="{ row }">
				<div v-if="row.getIsGrouped()" class="flex items-center">
					<span class="inline-block" :style="{ width: `calc(${row.depth} * 1rem)` }" />

					<UButton
						variant="outline"
						color="neutral"
						class="mr-2"
						size="xs"
						:icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
						@click="row.toggleExpanded()"
					/>
					<strong v-if="row.groupingColumnId === 'year_label'">{{
						row.original.yearLabel
					}}</strong>
					<strong v-else-if="row.groupingColumnId === 'quarter_label'">{{
						row.original.quarterLabel
					}}</strong>
				</div>
			</template>
		</UTable>
	</div>
</template>
