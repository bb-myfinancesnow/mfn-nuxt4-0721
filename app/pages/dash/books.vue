<script lang="ts" setup>
import {
	ListBookDataDocument,
	type ListBookDataQuery
} from '~/generated/graphql';

definePageMeta({
	layout: 'dash'
});

const { request } = useGql();

const { data: bookData, pending } = await useLazyAsyncData('bookdatalist', () =>
	request<ListBookDataQuery>(ListBookDataDocument)
);
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
		</template>
		<template #body>
			<div>
				<UTable
					:data="bookData?.books ?? []"
					class="flex-1"
					:loading="pending || !bookData?.books"
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
