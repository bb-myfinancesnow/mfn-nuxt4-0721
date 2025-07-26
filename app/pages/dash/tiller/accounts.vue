<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import {
	SearchTillerAccRecordsDocument,
	SortOrder,
	type SearchTillerAccRecordsQueryVariables,
	type SearchTillerAccRecordsQuery
} from '~/generated/graphql';

const { request } = useGql();

const { data: tillerData, pending } = await useLazyAsyncData(
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
		<UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
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
				<div>
					xxx
				</div>
			</template>
		</UPageCard>
		<UTable
			ref="table"
			v-model:column-visibility="columnVisibility"
			:data="tillerData"
			:loading="pending"
			:columns="columns"
			class="w-full"
			:ui="{
				base: 'table-fixed border-separate border-spacing-0',
				thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
				tbody: '[&>tr]:last:[&>td]:border-b-0',
				th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
				td: 'border-b border-default'
			}"
		/>
		<!-- <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				data:
				<pre>{{ tillerData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid> -->
	</div>
</template>
