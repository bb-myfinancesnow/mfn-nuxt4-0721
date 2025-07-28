<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const links = [
	[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			to: '/dash/fusion',
			exact: true
		},
		{
			label: 'Grid',
			icon: 'i-lucide-grid-3x3',
			to: '/dash/fusion/grid'
		}
		// {
		// 	label: 'Financials',
		// 	icon: 'i-lucide-receipt',
		// 	to: '/settings/notifications'
		// },
		// {
		// 	label: 'Data View',
		// 	icon: 'i-lucide-list',
		// 	to: '/dash/reporting/data-view'
		// }
	],
	[
		{
			label: 'Syncfusion Vue',
			icon: 'i-lucide-book-open',
			to: 'https://ej2.syncfusion.com/vue/documentation/introduction',
			target: '_blank'
		},
		{
			label: 'API Docs',
			icon: 'i-lucide-file-code',
			to: 'https://ej2.syncfusion.com/vue/documentation/api/grid/overview/',
			target: '_blank'
		}
	]
] satisfies NavigationMenuItem[][];
</script>

<template>
	<UDashboardPanel
		id="fusionhome"
		:ui="{ body: 'lg:py-12' }"
	>
		<template #header>
			<UDashboardNavbar title="SyncFusion Components">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
				<UNavigationMenu
					:items="links"
					highlight
					class="-mx-1 flex-1"
				/>
			</UDashboardToolbar>
		</template>

		<template #body>
			<NuxtPage />
		</template>
	</UDashboardPanel>
</template>
