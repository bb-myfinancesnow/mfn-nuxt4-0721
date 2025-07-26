<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import {
	SearchTillerAccRecordsDocument,
	SortOrder,
	type SearchTillerAccRecordsQueryVariables,
	type SearchTillerAccRecordsQuery
} from '~/generated/graphql';
import { upperFirst } from 'scule';
import { getPaginationRowModel, type Column } from '@tanstack/vue-table';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const { request } = useGql();

const {
	data: tillerData,
	pending,
	refresh: refreshAccQuery
} = await useLazyAsyncData(
	'listtilleraccs',
	() =>
		request<
			SearchTillerAccRecordsQuery,
			SearchTillerAccRecordsQueryVariables
		>(SearchTillerAccRecordsDocument, {
			orderBy: [{ id: SortOrder.Asc }]
		}),
	{
		transform: (input): TTillerAccRecordSchema[] => {
			const arrSchema = TillerAccRecordSchema.array();
			const parsedData = arrSchema.parse(input.tillerAccounts);
			return parsedData;
		},
		default: () => [] as TTillerAccRecordSchema[]
	}
);

const table = useTemplateRef('table');
const columnVisibility = ref({
	createdAt: false,
	updatedAt: false,
	accountId: false
});

const pagination = ref({
	pageIndex: 0,
	pageSize: 10
});

const sorting = ref([
	{
		id: 'id',
		desc: false
	}
]);

const columns: TableColumn<TTillerAccRecordSchema>[] = [
	{
		accessorKey: 'id',
		// header: '#',
		cell: ({ row }) => `#${row.getValue('id')}`,
		enableHiding: false,
		header: ({ column }) => {
			const isSorted = column.getIsSorted();

			return h(UButton, {
				color: 'neutral',
				variant: 'ghost',
				label: '#',
				icon: isSorted
					? isSorted === 'asc'
						? 'i-lucide-arrow-up-narrow-wide'
						: 'i-lucide-arrow-down-wide-narrow'
					: 'i-lucide-arrow-up-down',
				class: '-mx-2.5',
				onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			});
		}
	},
	{
		accessorKey: 'name',
		// header: 'Name',
		enableHiding: false,
		header: ({ column }) => getHeader(column, 'Name')
	},
	{
		accessorKey: 'group',
		header: ({ column }) => getHeader(column, 'Group')
		// header: 'Group'
	},
	{
		accessorKey: 'institution',
		// header: 'Institution',
		header: ({ column }) => getHeader(column, 'Institution')
	},
	{
		id: 'glAcc',
		accessorFn: (row) => row.glAccount.accountLabel,
		header: ({ column }) => getHeader(column, 'GL Acc')
	},
	{
		accessorKey: '_count.tillerTrans',
		header: ({ column }) => getHeader(column, 'Tran Count'),
		enableGlobalFilter: false
		// header: 'Tran Count'
	},
	{
		accessorKey: 'accountId',
		header: 'Acc ID'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ row }) => {
			return formatDateTimeObjVal(row.original.createdAt);
		}
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated',
		cell: ({ row }) => {
			return formatDateTimeObjVal(row.original.updatedAt);
		}
	}
];

function getHeader(column: Column<TTillerAccRecordSchema>, label: string) {
	const isSorted = column.getIsSorted();

	return h(
		UDropdownMenu,
		{
			content: {
				align: 'start'
			},
			'aria-label': 'Actions dropdown',
			items: [
				{
					label: 'Asc',
					type: 'checkbox',
					icon: 'i-lucide-arrow-up-narrow-wide',
					checked: isSorted === 'asc',
					onSelect: () => {
						if (isSorted === 'asc') {
							column.clearSorting();
						} else {
							column.toggleSorting(false);
						}
					}
				},
				{
					label: 'Desc',
					icon: 'i-lucide-arrow-down-wide-narrow',
					type: 'checkbox',
					checked: isSorted === 'desc',
					onSelect: () => {
						if (isSorted === 'desc') {
							column.clearSorting();
						} else {
							column.toggleSorting(true);
						}
					}
				}
			]
		},
		() =>
			h(UButton, {
				color: 'neutral',
				variant: 'ghost',
				label,
				icon: isSorted
					? isSorted === 'asc'
						? 'i-lucide-arrow-up-narrow-wide'
						: 'i-lucide-arrow-down-wide-narrow'
					: 'i-lucide-arrow-up-down',
				class: '-mx-2.5 data-[state=open]:bg-elevated',
				'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
			})
	);
}

const q = ref('');
</script>

<template>
	<div>
		<UPageCard
			variant="subtle"
			:ui="{
				container: 'p-0 sm:p-0 gap-y-0',
				wrapper: 'items-stretch',
				header: 'p-4 mb-0 border-b border-default'
			}"
		>
			<template #header>
				<UInput
					v-model="q"
					icon="i-lucide-search"
					placeholder="Search..."
					autofocus
					class="w-1/4"
				/>
			</template>

			<template #body>
				<div
					class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto"
				>
					<UTooltip text="Refresh Accounts">
						<UButton
							icon="i-lucide-rotate-ccw-key"
							class="rounded-full"
							size="lg"
							:loading="pending"
							@click="refreshAccQuery()"
						/>
					</UTooltip>
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
							:disabled="pending"
						/>
					</UDropdownMenu>
				</div>
			</template>
		</UPageCard>
		<UTable
			ref="table"
			v-model:global-filter="q"
			v-model:column-visibility="columnVisibility"
			v-model:pagination="pagination"
			v-model:sorting="sorting"
			:data="tillerData"
			:loading="pending"
			:columns="columns"
			:pagination-options="{
				getPaginationRowModel: getPaginationRowModel()
			}"
			class="w-full"
			:ui="{
				base: 'table-fixed border-separate border-spacing-0',
				thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
				tbody: '[&>tr]:last:[&>td]:border-b-0',
				th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
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
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<div>status: {{ String(pending) }}</div>
				<pre>{{ tillerData }}</pre>
			</div>
		</UPageGrid>
	</div>
</template>
