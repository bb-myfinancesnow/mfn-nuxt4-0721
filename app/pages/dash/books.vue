<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import {
	ListBookDataDocument,
	SortOrder,
	type ListBookDataQuery,
	type ListBookDataQueryVariables
} from '~/generated/graphql';

definePageMeta({
	layout: 'dash'
});

const DisplayBoolBadge = resolveComponent('DisplayBoolBadge');

const { request } = useGql();

const {
	data: bookData,
	pending,
	refresh
} = await useLazyAsyncData(
	'bookdatalist',
	() =>
		request<ListBookDataQuery, ListBookDataQueryVariables>(
			ListBookDataDocument,
			{
				orderBy: [{ id: SortOrder.Asc }]
			}
		),
	{
		transform: (input): TBookRecordSchema[] => {
			const arrSchema = BookRecordSchema.array();
			const parsedData = arrSchema.parse(input.books);
			return parsedData;
		}
	}
);

const columns: TableColumn<TBookRecordSchema>[] = [
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
		accessorKey: 'system',
		header: 'System',
		cell: ({ row }) => {
			const val = row.original.system;
			return h(DisplayBoolBadge, { val });
		}
	},
	{
		accessorKey: '_count.journals',
		header: 'Journal Count'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ row }) => {
			return row.original.createdAt.toLocaleString('en-US', {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			});
		}
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated',
		cell: ({ row }) => {
			return formatDateTimeObjVal(row.original.updatedAt);
		}
	}
	// {
	// 	accessorKey: 'createdAt',
	// 	header: 'Created',
	// 	cell: ({ row }) => {
	// 		return formatDateTimeObjVal(row.original.createdAt);
	// 	}
	// }
];
</script>

<template>
	<UDashboardPanel id="dashbooks">
		<template #header>
			<UDashboardNavbar
				title="Books Home"
				:ui="{ right: 'gap-3' }"
			>
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UColorModeSelect />
				</template>
			</UDashboardNavbar>
			<UDashboardToolbar>
				<template #left>
					<UButton
						label="Refresh Books"
						leading-icon="i-lucide-refresh-ccw"
						class="-ms-1"
						variant="outline"
						:loading="pending"
						@click="refresh()"
					/>
				</template>
				<template #right>
					<BooksAddModal @saved-new="refresh()" />
				</template>
			</UDashboardToolbar>
		</template>
		<template #body>
			<div>
				<UTable
					:data="bookData ?? []"
					:columns="columns"
					class="shrink-0"
					:loading="pending || !bookData"
					:ui="{
						base: 'table-fixed border-separate border-spacing-0',
						thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
						tbody: '[&>tr]:last:[&>td]:border-b-0',
						th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
						td: 'border-b border-default'
					}"
				/>
			</div>

			<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
				<div>
					data:
					<pre>{{ bookData }}</pre>
				</div>
				<div>status: {{ String(pending) }}</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
