<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import {
	ListBookDataDocument,
	RemoveBookDocument,
	SortOrder,
	type ListBookDataQuery,
	type ListBookDataQueryVariables,
	type RemoveBookMutation,
	type RemoveBookMutationVariables
} from '~/generated/graphql';
import type { Row } from '@tanstack/vue-table';
import { useClipboard } from '@vueuse/core';

definePageMeta({
	layout: 'dash'
});

const DisplayBoolBadge = resolveComponent('DisplayBoolBadge');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const { copy } = useClipboard();

const { request } = useGql();

const isSubmitting = ref(false);

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

const handleDeleteBook = async (book: TBookRecordSchema) => {
	isSubmitting.value = true;
	await new Promise((r) => setTimeout(r, 2000));
	const bookLabel = `${book.id}-${book.name}`;
	if (book.system) {
		toast.add({
			title: 'Invalid Delete',
			description: `Cannot delete system book ${bookLabel}`,
			icon: 'i-lucide-triangle-alert',
			color: 'error'
		});
		isSubmitting.value = false;
	} else if (book._count.journals > 0) {
		toast.add({
			title: 'Invalid Delete',
			description: `Cannot delete book with ${book._count.journals} postings ${bookLabel}`,
			icon: 'i-lucide-triangle-alert',
			color: 'error'
		});
		isSubmitting.value = false;
	} else {
		try {
			const delRes = await request<
				RemoveBookMutation,
				RemoveBookMutationVariables
			>(RemoveBookDocument, { id: book.id });
			console.log(`delRes is: ${JSON.stringify(delRes, null, 2)}`);
			toast.add({
				title: 'Success Delete',
				description: `Successfully deleted book ${bookLabel}`,
				color: 'success',
				icon: 'i-lucide-trash-2'
			});
			await new Promise((r) => setTimeout(r, 2000));
			isSubmitting.value = false;
			refresh();
		} catch (e) {
			console.error(`delete book err: ${e}`);
			isSubmitting.value = false;
		}
	}
};

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
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return h(
				'div',
				{ class: 'text-right' },
				h(
					UDropdownMenu,
					{
						content: {
							align: 'end'
						},
						items: getRowItems(row),
						'aria-label': 'Actions dropdown'
					},
					() =>
						h(UButton, {
							icon: 'i-lucide-ellipsis-vertical',
							color: 'neutral',
							variant: 'ghost',
							class: 'ml-auto',
							'aria-label': 'Actions dropdown'
						})
				)
			);
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

function getRowItems(row: Row<TBookRecordSchema>) {
	return [
		{
			type: 'label',
			label: 'Actions'
		},
		{
			label: 'Copy Book ID',
			icon: 'i-lucide-copy',
			onSelect() {
				copy(String(row.original.id));
				toast.add({
					title: 'Book ID copied to clipboard!',
					color: 'success',
					icon: 'i-lucide-circle-check'
				});
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'View book details',
			icon: 'i-lucide-list',
			onSelect() {
				toast.add({
					title: 'View Book Details',
					description: `View detail for book ${row.original.name}`,
					color: 'success',
					icon: 'i-lucide-circle-check'
				});
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Delete book',
			icon: 'i-lucide-trash',
			color: 'error',
			// disabled: row.original.system,
			onSelect() {
				handleDeleteBook(row.original);
			}
		}
	];
}
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
						:loading="pending || isSubmitting"
						:disabled="pending || isSubmitting"
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
					:loading="pending || !bookData || isSubmitting"
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
