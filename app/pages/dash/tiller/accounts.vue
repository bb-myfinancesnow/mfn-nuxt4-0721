<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import {
	SearchTillerAccRecordsDocument,
	SortOrder,
	type SearchTillerAccRecordsQueryVariables,
	type SearchTillerAccRecordsQuery
} from '~/generated/graphql';
import { upperFirst } from 'scule';
import { getPaginationRowModel } from '@tanstack/vue-table';

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
	updatedAt: false
});

const pagination = ref({
	pageIndex: 0,
	pageSize: 10
});

const columns: TableColumn<TTillerAccRecordSchema>[] = [
	{
		accessorKey: 'id',
		header: '#',
		cell: ({ row }) => `#${row.getValue('id')}`
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'group',
		header: 'Group'
	},
	{
		accessorKey: 'institution',
		header: 'Institution'
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
			v-model:column-visibility="columnVisibility"
			v-model:pagination="pagination"
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
		<!-- <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid> -->
	</div>
</template>
